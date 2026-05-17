import { headers } from "next/headers";
import { db } from "@/services/db/index";
import { user } from "@/services/db/schema";
import { deleteCustomerByEmail } from "@/services/payments";
import {
  adminProcedure,
  authenticatedProcedure,
  createTRPCRouter,
} from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import { TRPCError } from "@trpc/server";
import { count, desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { isFeatureEnabled } from "@/config/features";

const getAuth = () => import("@/services/auth/auth").then((m) => m.auth);

export const usersRouter = createTRPCRouter({
  getCurrent: authenticatedProcedure
    .use(featureGuard("auth"))
    .query(async ({ ctx }) => {
      return ctx.session;
    }),

  get: adminProcedure
    .use(featureGuard("auth"))
    .input(z.string())
    .query(async ({ input }) => {
      return db
        .select()
        .from(user)
        .where(eq(user.id, input))
        .limit(1)
        .then((result) => result[0]);
    }),

  list: adminProcedure
    .use(featureGuard("auth"))
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
    .use(featureGuard("auth"))
    .input(z.string().optional())
    .query(async ({ input, ctx }) => {
      const userId = input;
      const auth = await getAuth();
      const accounts = await (
        await auth.$context
      ).internalAdapter.findAccounts(userId ?? ctx.session.user.id);
      return accounts;
    }),

  count: adminProcedure.use(featureGuard("auth")).query(async () => {
    return db.select({ count: count() }).from(user);
  }),

  update: authenticatedProcedure
    .use(featureGuard("auth"))
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
      const auth = await getAuth();
      await auth.api.updateUser({
        headers: await headers(),
        body: { ...input },
      });
      return { userId: ctx.session.user.id };
    }),

  adminUpdate: adminProcedure
    .use(featureGuard("auth"))
    .input(
      z
        .object({
          id: z.string(),
          name: z.string().optional(),
          image: z.string().optional(),
          banned: z.boolean().optional(),
          banReason: z.string().optional(),
          role: z.enum(["user", "admin"]).optional(),
          emailVerified: z.boolean().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
          message: "At least one field must be provided for update",
        })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      if (!id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User ID is required",
        });
      }

      return db
        .update(user)
        .set(data)
        .where(eq(user.id, id))
        .returning()
        .then((result) => result[0]);
    }),

  updatePassword: adminProcedure
    .use(featureGuard("auth"))
    .input(
      z.object({
        userId: z.string(),
        newPassword: z.string(),
        revokeAllSessions: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, newPassword, revokeAllSessions } = input;

      const auth = await getAuth();
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

  delete: adminProcedure
    .use(featureGuard("auth"))
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
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

      if (dbUser?.email && isFeatureEnabled("payments")) {
        await deleteCustomerByEmail(dbUser.email);
      }

      await db.delete(user).where(eq(user.id, input));

      return { success: true };
    }),
});
