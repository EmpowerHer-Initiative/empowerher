import { z } from "zod";

import { subscribeEmail } from "@/services/newsletter/subscribe";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";

import { rateLimit } from "../middleware/rate-limit";

export const newsletterRouter = createTRPCRouter({
  // Public subscribe used by the site-wide newsletter popup. Dedupes against the
  // full roster (accepted, rejected, newsletter) before inserting. Shares the
  // insert logic with the REST route at POST /api/newsletter.
  subscribe: baseProcedure
    .input(z.object({ email: z.email().max(255) }))
    .mutation(async ({ input }) => {
      await rateLimit(5, "1m");
      return subscribeEmail(input.email);
    }),
});
