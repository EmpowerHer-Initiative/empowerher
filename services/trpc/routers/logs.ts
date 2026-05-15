import { db } from "@/services/db/index";
import { activityLog } from "@/services/db/schema";
import { adminProcedure, createTRPCRouter } from "@/services/trpc/init";
import { and, count, desc, eq, ilike, lt, sql } from "drizzle-orm";
import { z } from "zod";

export const logsRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
        type: z.enum(["email", "data_change"]).optional(),
        status: z.enum(["success", "failed"]).optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { page = 1, limit = 20, type, status, search } = input;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (type) conditions.push(eq(activityLog.type, type));
      if (status) conditions.push(eq(activityLog.status, status));
      if (search) conditions.push(ilike(activityLog.summary, `%${search}%`));

      return db
        .select()
        .from(activityLog)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(activityLog.createdAt))
        .limit(limit)
        .offset(offset);
    }),

  count: adminProcedure
    .input(
      z
        .object({
          type: z.enum(["email", "data_change"]).optional(),
          status: z.enum(["success", "failed"]).optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const conditions = [];
      if (input?.type) conditions.push(eq(activityLog.type, input.type));
      if (input?.status) conditions.push(eq(activityLog.status, input.status));
      if (input?.search)
        conditions.push(ilike(activityLog.summary, `%${input.search}%`));

      return db
        .select({ count: count() })
        .from(activityLog)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
    }),

  delete: adminProcedure.input(z.string()).mutation(async ({ input }) => {
    await db.delete(activityLog).where(eq(activityLog.id, input));
    return { success: true };
  }),

  purgePreview: adminProcedure.query(async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const breakdown = await db
      .select({
        type: activityLog.type,
        status: activityLog.status,
        count: count(),
        oldest: sql<string>`min(${activityLog.createdAt})`,
      })
      .from(activityLog)
      .where(lt(activityLog.createdAt, thirtyDaysAgo))
      .groupBy(activityLog.type, activityLog.status);

    const total = breakdown.reduce((sum, row) => sum + row.count, 0);

    return { total, breakdown };
  }),

  purge: adminProcedure.mutation(async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await db
      .delete(activityLog)
      .where(lt(activityLog.createdAt, thirtyDaysAgo))
      .returning({ id: activityLog.id });

    return { deleted: result.length };
  }),
});
