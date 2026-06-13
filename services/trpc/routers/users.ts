import { headers } from "next/headers";
import { auth } from "@/services/auth/auth";
import { db } from "@/services/db/index";
import { account, user, type UserMetadata } from "@/services/db/schema";
import { deleteCustomerByEmail } from "@/services/payments";
import {
  adminProcedure,
  authenticatedProcedure,
  createTRPCRouter,
} from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

async function mergeUserMetadata(userId: string, patch: Partial<UserMetadata>) {
  const [current] = await db
    .select({ metadata: user.metadata })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  const merged = { ...((current?.metadata ?? {}) as UserMetadata), ...patch };
  await db.update(user).set({ metadata: merged }).where(eq(user.id, userId));
  return merged;
}

export const usersRouter = createTRPCRouter({
  getCurrent: authenticatedProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),

  get: adminProcedure.input(z.string()).query(async ({ input }) => {
    return db
      .select()
      .from(user)
      .where(eq(user.id, input))
      .limit(1)
      .then((result) => result[0]);
  }),

  list: adminProcedure
    .input(
      z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
        sortBy: z.enum(["email", "created", "banned"]).optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page = 1, limit = 10, sortBy, search } = input;
      const offset = (page - 1) * limit;

      return db
        .select()
        .from(user)
        .limit(limit)
        .offset(offset)
        .orderBy(
          sortBy === "email"
            ? desc(user.email)
            : sortBy === "banned"
              ? desc(user.banned)
              : desc(user.createdAt)
        )
        .where(
          search
            ? or(
                ilike(user.email, `%${search}%`),
                ilike(user.name, `%${search}%`)
              )
            : undefined
        );
    }),

  listAccounts: authenticatedProcedure
    .input(z.string().optional())
    .query(async ({ input, ctx }) => {
      const userId = input;
      const accounts = await (
        await auth.$context
      ).internalAdapter.findAccounts(userId ?? ctx.session.user.id);
      return accounts;
    }),

  count: adminProcedure.query(async () => {
    return db.select({ count: count() }).from(user);
  }),

  update: authenticatedProcedure
    .input(
      z
        .object({
          name: z.string().optional(),
          image: z.string().optional(),
        })
        .partial()
        .refine((data) => Object.keys(data).length > 0, {
          message: "At least one field must be provided for update",
        })
        .strict()
    )
    .mutation(async ({ input, ctx }) => {
      await auth.api.updateUser({
        headers: await headers(),
        body: { ...input },
      });
      return { userId: ctx.session.user.id };
    }),

  adminUpdate: adminProcedure
    .input(
      z
        .object({
          id: z.string(),
          name: z.string().optional(),
          image: z.string().optional(),
          banned: z.boolean().optional(),
          banReason: z.string().optional(),
          role: z.enum(["user", "staff", "admin"]).optional(),
          emailVerified: z.boolean().optional(),
          metadata: z.record(z.string(), z.unknown()).optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
          message: "At least one field must be provided for update",
        })
    )
    .mutation(async ({ input }) => {
      const { id, metadata: metadataPatch, ...data } = input;

      if (!id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User ID is required",
        });
      }

      if (metadataPatch) {
        await mergeUserMetadata(id, metadataPatch);
      }

      if (Object.keys(data).length > 0) {
        return db
          .update(user)
          .set(data)
          .where(eq(user.id, id))
          .returning()
          .then((result) => result[0]);
      }

      return db
        .select()
        .from(user)
        .where(eq(user.id, id))
        .limit(1)
        .then((result) => result[0]);
    }),

  updatePassword: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        newPassword: z.string(),
        revokeAllSessions: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, newPassword, revokeAllSessions } = input;

      const { status } = await auth.api.setUserPassword({
        body: { newPassword, userId },
        headers: await headers(),
      });

      if (!status) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to change password",
        });
      }

      if (revokeAllSessions) {
        const { success } = await auth.api.revokeUserSessions({
          body: { userId },
          headers: await headers(),
        });

        if (!success) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to revoke sessions",
          });
        }
      }

      return true;
    }),

  changeOwnPassword: authenticatedProcedure
    .input(
      z.object({
        newPassword: z.string().min(8),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [currentUser] = await db
        .select({ metadata: user.metadata })
        .from(user)
        .where(eq(user.id, ctx.session.user.id))
        .limit(1);

      const metadata = (currentUser?.metadata ?? {}) as UserMetadata;

      if (metadata.mustChangePassword !== true) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Password change is not required",
        });
      }

      const authCtx = await auth.$context;
      const hashedPassword = await authCtx.password.hash(input.newPassword);

      const [updated] = await db
        .update(account)
        .set({ password: hashedPassword })
        .where(
          and(
            eq(account.userId, ctx.session.user.id),
            eq(account.providerId, "credential")
          )
        )
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to change password",
        });
      }

      const { mustChangePassword, ...restMeta } = metadata;

      await auth.api.updateUser({
        headers: await headers(),
        body: { metadata: restMeta },
      });

      return true;
    }),

  dismissPasswordChange: authenticatedProcedure.mutation(async ({ ctx }) => {
    const [current] = await db
      .select({ metadata: user.metadata })
      .from(user)
      .where(eq(user.id, ctx.session.user.id))
      .limit(1);

    const { mustChangePassword, ...restMeta } = (current?.metadata ??
      {}) as UserMetadata;

    await auth.api.updateUser({
      headers: await headers(),
      body: { metadata: restMeta },
    });

    return true;
  }),

  updateMetadata: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        metadata: z.record(z.string(), z.unknown()),
      })
    )
    .mutation(async ({ input }) => {
      return mergeUserMetadata(input.userId, input.metadata);
    }),

  removeMetadataKey: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        key: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [current] = await db
        .select({ metadata: user.metadata })
        .from(user)
        .where(eq(user.id, input.userId))
        .limit(1);

      const currentMeta = {
        ...((current?.metadata ?? {}) as UserMetadata),
      };
      delete currentMeta[input.key];

      await db
        .update(user)
        .set({ metadata: currentMeta })
        .where(eq(user.id, input.userId));

      return currentMeta;
    }),

  delete: adminProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    if (ctx.session.user.id === input) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You cannot delete your own account",
      });
    }

    const dbUser = await db
      .select()
      .from(user)
      .where(eq(user.id, input))
      .limit(1)
      .then((res) => res[0]);

    if (dbUser?.email) {
      await deleteCustomerByEmail(dbUser.email);
    }

    await db.delete(user).where(eq(user.id, input));

    return { success: true };
  }),
});
