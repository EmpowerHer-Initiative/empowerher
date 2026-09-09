import { z } from "zod";

import { addComment, getApprovedComments } from "@/services/comments";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";

import { rateLimit } from "../middleware/rate-limit";

export const commentsRouter = createTRPCRouter({
  getBlogComments: baseProcedure
    .input(z.object({ slug: z.string().min(1).max(255) }))
    .query(async ({ input }) => {
      return getApprovedComments(input.slug);
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

      // Status defaults to "pending" — moderation happens in the admin panel.
      await addComment(input);

      return { success: true };
    }),
});
