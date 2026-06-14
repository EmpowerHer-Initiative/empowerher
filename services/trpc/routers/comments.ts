import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/services/db/index";
import { commentsTable } from "@/services/db/schema";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";

import { rateLimit } from "../middleware/rate-limit";

export const commentsRouter = createTRPCRouter({
  getBlogComments: baseProcedure
    .input(z.object({ slug: z.string().min(1).max(255) }))
    .query(async ({ input }) => {
      return db
        .select()
        .from(commentsTable)
        .where(
          and(
            eq(commentsTable.blogName, input.slug),
            eq(commentsTable.status, "approved")
          )
        )
        .orderBy(desc(commentsTable.createdAt));
    }),

  add: baseProcedure
    .input(
      z.object({
        from: z.string().min(1).max(255),
        blogName: z.string().min(1).max(255),
        message: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ input }) => {
      await rateLimit(1, 60);

      // Status is always "pending" — moderation happens in the admin panel.
      await db.insert(commentsTable).values(input);

      return { success: true };
    }),
});
