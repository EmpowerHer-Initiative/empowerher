import { headers } from "next/headers";
import { auth } from "@/services/auth/auth";
import { db } from "@/services/db/index";
import { session, verification } from "@/services/db/schema";
import {
  authenticatedProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

import { rateLimit } from "../middleware/rate-limit";

export const authRouter = createTRPCRouter({
  // ── Queries ──────────────────────────────────────────────

  /**
   * Fetches the current user session.
   * Uses headers from the incoming request (works for both direct caller and HTTP calls).
   * @returns Promise<User> - The current user from session
   */
  getSession: authenticatedProcedure.query(async ({ ctx }) => {
    return ctx.session.user;
  }),

  /**
   * Fetches all sessions for a specific user
   * @param userId - The ID of the user to get sessions for
   * @returns Promise<Session[]> - Array of user sessions sorted by creation date (newest first)
   */
  listSessions: baseProcedure.input(z.string()).query(async ({ input }) => {
    try {
      const userId = input;

      const sessions = await auth.api
        .listUserSessions({
          body: {
            userId,
          },
          // This endpoint requires session cookies.
          headers: await headers(),
        })
        .then((res) =>
          res.sessions.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          )
        );

      return sessions;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to fetch sessions",
        cause: error,
      });
    }
  }),

  /**
   * Validates a password reset token
   * @param token - The reset password token to validate
   * @returns Promise<Verification> - The verification record if token is valid
   */
  validateResetToken: baseProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
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
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to validate token",
          cause: error,
        });
      }
    }),

  // ── Mutations ────────────────────────────────────────────

  /**
   * Revokes/deletes a specific session
   * @param sessionId - The ID of the session to revoke
   * @returns Promise<{data?: void, error?: string}>
   */
  revokeSession: authenticatedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      try {
        const sessionId = input;
        await db.delete(session).where(eq(session.id, sessionId));
        return true;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to revoke session",
          cause: error,
        });
      }
    }),

  testRateLimit: baseProcedure.mutation(async () => {
    await rateLimit();
    return "Rate limit test";
  }),
});
