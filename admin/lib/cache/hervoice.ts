import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { asc, desc } from "drizzle-orm";

import { CACHE_TAGS } from "@/services/cache/tags";
import { db } from "@/services/db/index";
import { hervoiceTable } from "@/services/db/schema";

/**
 * Single cached read for all public HerVoice pages (listing, detail, sitemap).
 * One `"use cache"` entry (no args) tagged `hervoice`, busted only by
 * revalidateTag("hervoice") — the admin Publish button. The detail page reads
 * this same list and filters by slug, so every page shares one cache entry and
 * they can never drift out of sync.
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
