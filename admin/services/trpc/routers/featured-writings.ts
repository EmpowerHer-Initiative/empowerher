import { cacheLife, cacheTag } from "next/cache";
import { desc } from "drizzle-orm";

import { CACHE_TAGS } from "@/services/cache/tags";
import { db } from "@/services/db/index";
import { featuredWritingsTable } from "@/services/db/schema";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";

export const featuredWritingsRouter = createTRPCRouter({
  list: baseProcedure.query(async () => {
    "use cache";
    cacheLife("max");
    cacheTag(CACHE_TAGS.featuredWritings);

    return db
      .select()
      .from(featuredWritingsTable)
      .orderBy(desc(featuredWritingsTable.createdAt));
  }),
});
