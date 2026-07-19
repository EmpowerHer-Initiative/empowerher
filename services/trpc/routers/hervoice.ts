import { cacheLife, cacheTag } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { CACHE_TAGS } from "@/services/cache/tags";
import { db } from "@/services/db/index";
import { hervoiceTable } from "@/services/db/schema";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";

/**
 * Cached HerVoice reads. Call these DIRECTLY from Server Components (not through
 * the tRPC `caller`) so the `"use cache"` entry is created in the RSC render and
 * reliably persists in the Data Cache — busted only by revalidateTag("hervoice")
 * (the admin Publish button). Both are tagged the same, so one publish refreshes
 * the listing and every detail page together.
 */
export async function getHervoiceStories() {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.hervoice);

  return db
    .select()
    .from(hervoiceTable)
    .orderBy(desc(hervoiceTable.createdAt), asc(hervoiceTable.title));
}

export async function getHervoiceBySlug(slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.hervoice);

  const [story] = await db
    .select()
    .from(hervoiceTable)
    .where(eq(hervoiceTable.slug, slug))
    .limit(1);

  return story ?? null;
}

export const hervoiceRouter = createTRPCRouter({
  list: baseProcedure.query(() => getHervoiceStories()),
  bySlug: baseProcedure
    .input(z.string())
    .query(({ input }) => getHervoiceBySlug(input)),
});
