import { cacheLife, cacheTag } from "next/cache";
import { asc } from "drizzle-orm";

import { CACHE_TAGS } from "@/services/cache/tags";
import { db } from "@/services/db";
import { partnersTable } from "@/services/db/schema";

import "server-only";

export async function getPartners() {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.partners);

  return db.select().from(partnersTable).orderBy(asc(partnersTable.index));
}
