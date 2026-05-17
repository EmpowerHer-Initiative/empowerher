import { headers } from "next/headers";
import { db } from "@/services/db/index";
import { session, verification } from "@/services/db/schema";
import {
  adminProcedure,
  authenticatedProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

import { rateLimit } from "../middleware/rate-limit";

const getAuth = () => import("@/services/auth/auth").then((m) => m.auth);

export const authRouter = createTRPCRouter({
  getSession: authenticatedProcedure
    .use(featureGuard("auth"))
    .query(async ({ ctx }) => {
      return ctx.session.user;
    }),

  listSessions: adminProcedure
    .use(featureGuard("auth"))
    .input(z.string())
    .query(async ({ input }) => {
      const auth = await getAuth();
      const sessions = await auth.api.listUserSessions({
        body: { userId: input },
        headers: await headers(),
      });

      return sessions.sessions.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    }),

  validateResetToken: baseProcedure
    .use(featureGuard("auth"))
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const data = await db
        .select()
        .from(verification)
        .where(eq(verification.identifier, `reset-password:${input.token}`))
        .then((res) => res[0]);

      if (!data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid token",
        });
      }

      return data;
    }),

  revokeSession: authenticatedProcedure
    .use(featureGuard("auth"))
    .input(z.string())
    .mutation(async ({ input }) => {
      await db.delete(session).where(eq(session.id, input));
      return true;
    }),

  testRateLimit: baseProcedure.mutation(async () => {
    await rateLimit();
    return "Rate limit test";
  }),
});
