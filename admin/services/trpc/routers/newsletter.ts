import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/services/db/index";
import {
  allStudentsTable,
  rejectedStudentsTable,
  studentsTable,
} from "@/services/db/schema";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";

import { rateLimit } from "../middleware/rate-limit";

export const newsletterRouter = createTRPCRouter({
  // Public subscribe used by the site-wide newsletter popup. Dedupes against the
  // full roster (accepted, rejected, newsletter) before inserting.
  subscribe: baseProcedure
    .input(z.object({ email: z.email().max(255) }))
    .mutation(async ({ input }) => {
      await rateLimit(5, "1m");

      const email = input.email.trim().toLowerCase();

      for (const table of [
        studentsTable,
        rejectedStudentsTable,
        allStudentsTable,
      ]) {
        const [existing] = await db
          .select({ email: table.email })
          .from(table)
          .where(eq(table.email, email))
          .limit(1);

        if (existing) {
          return { alreadySubscribed: true };
        }
      }

      await db.insert(allStudentsTable).values({ email }).onConflictDoNothing();

      return { alreadySubscribed: false };
    }),
});
