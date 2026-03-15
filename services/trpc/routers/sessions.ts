import { headers } from "next/headers";
import { auth } from "@/services/auth/auth";
import { db } from "@/services/db/index";
import { session } from "@/services/db/schema";
import {
  authenticatedProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

export const sessionsRouter = createTRPCRouter({
  /**
   * Fetches all sessions for a specific user
   * @param userId - The ID of the user to get sessions for
   * @returns Promise<Session[]> - Array of user sessions sorted by creation date (newest first)
   */
  getSessions: baseProcedure.input(z.string()).query(async ({ input }) => {
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
});
