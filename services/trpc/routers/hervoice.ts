import { cacheLife, cacheTag } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { CACHE_TAGS } from "@/services/cache/tags";
import { db } from "@/services/db/index";
import { hervoiceTable } from "@/services/db/schema";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";

export const hervoiceRouter = createTRPCRouter({
  list: baseProcedure.query(async () => {
    "use cache";
    cacheLife("max");
    cacheTag(CACHE_TAGS.hervoice);

    return db
      .select()
      .from(hervoiceTable)
      .orderBy(desc(hervoiceTable.createdAt), asc(hervoiceTable.title));
  }),

  bySlug: baseProcedure.input(z.string()).query(async ({ input }) => {
    "use cache";
    cacheLife("max");
    cacheTag(CACHE_TAGS.hervoice);

    const [story] = await db
      .select()
      .from(hervoiceTable)
      .where(eq(hervoiceTable.slug, input))
      .limit(1);

    return story ?? null;
  }),
});
