import { db } from "@/services/db/index";
import { commentsTable } from "@/services/db/schema";
import { adminProcedure, createTRPCRouter } from "@/services/trpc/init";
import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";

export const adminCommentsRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        status: z.array(z.enum(["pending", "approved", "rejected"])).optional(),
        blogName: z.string().max(255).optional(),
      })
    )
    .query(async ({ input }) => {
      const conditions = [];

      if (input.status?.length) {
        conditions.push(inArray(commentsTable.status, input.status));
      }
      if (input.blogName) {
        conditions.push(eq(commentsTable.blogName, input.blogName));
      }

      return db
        .select()
        .from(commentsTable)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(commentsTable.createdAt));
    }),

  update: adminProcedure
    .input(
      z
        .object({
          id: z.number().int(),
          from: z.string().min(1).max(255).optional(),
          blogName: z.string().min(1).max(255).optional(),
          message: z.string().min(1).optional(),
          status: z.enum(["pending", "approved", "rejected"]).optional(),
        })
        .refine((data) => Object.keys(data).length > 1, {
          message: "At least one field must be provided for update",
        })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      return db
        .update(commentsTable)
        .set(data)
        .where(eq(commentsTable.id, id))
        .returning()
        .then((result) => result[0]);
    }),

  delete: adminProcedure.input(z.number().int()).mutation(async ({ input }) => {
    await db.delete(commentsTable).where(eq(commentsTable.id, input));
    return { success: true };
  }),
});
