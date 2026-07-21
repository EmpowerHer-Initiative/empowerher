import { cacheLife, cacheTag } from "next/cache";
import { desc } from "drizzle-orm";

import { CACHE_TAGS } from "@/services/cache/tags";
import { db } from "@/services/db/index";
import { resourcesTable } from "@/services/db/schema";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";

export const resourcesRouter = createTRPCRouter({
  list: baseProcedure.query(async () => {
    "use cache";
    cacheLife("max");
    cacheTag(CACHE_TAGS.resources);

    return db
      .select()
      .from(resourcesTable)
      .orderBy(desc(resourcesTable.createdAt));
  }),
});
