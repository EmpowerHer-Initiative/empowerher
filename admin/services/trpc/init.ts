import { cache } from "react";
import { headers } from "next/headers";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/services/auth/auth";
import { db } from "@/services/db/index";
import { verification } from "@/services/db/schema";

export const createTRPCContext = cache(async () => {});

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const createMiddleware = t.middleware;

export const baseProcedure = t.procedure;
export const authenticatedProcedure = baseProcedure.use(
  async ({ next, ctx }) => {
    const headerList = await headers();
    const headersObj = Object.fromEntries(headerList.entries());

    const isMobile = headersObj["x-trpc-source"] === "expo-react";
    const isUsingAuthBearer =
      headersObj["authorization"]?.startsWith("Bearer ");

    /**
     * We will only allow the bearer token for mobile apps.
     */
    if (!isMobile && isUsingAuthBearer) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You should use the session token instead of the bearer token",
      });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Session is already fetched and cached in context (via React cache())
    if (!session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to access this resource",
      });
    }

    return next({ ctx: { ...ctx, session } });
  }
);
export const adminProcedure = authenticatedProcedure.use(
  async ({ next, ctx }) => {
    if (ctx.session.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized to access this resource",
      });
    }

    return next({ ctx });
  }
);

export const staffProcedure = authenticatedProcedure.use(
  async ({ next, ctx }) => {
    const role = ctx.session.user.role;

    if (role !== "admin" && role !== "staff") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized to access this resource",
      });
    }

    return next({ ctx });
  }
);

export const verificationProcedure = baseProcedure
  .input(z.object({ id: z.string() }))
  .use(async ({ next, input, ctx }) => {
    const [verificationRecord] = await db
      .select()
      .from(verification)
      .where(eq(verification.id, input.id))
      .limit(1);

    if (!verificationRecord) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Verification not found",
      });
    }

    if (verificationRecord.expiresAt < new Date()) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Verification has expired",
      });
    }

    return next({ ctx: { ...ctx, verification: verificationRecord } });
  });
