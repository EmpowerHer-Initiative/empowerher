import { cacheLife, cacheTag } from "next/cache";
import { desc, eq } from "drizzle-orm";

import { CACHE_TAGS } from "@/services/cache/tags";
import { db } from "@/services/db/index";
import { workshopsTable } from "@/services/db/schema";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";

export const workshopsRouter = createTRPCRouter({
  list: baseProcedure.query(async () => {
    "use cache";
    cacheLife("max");
    cacheTag(CACHE_TAGS.workshops);

    return db
      .select()
      .from(workshopsTable)
      .where(eq(workshopsTable.status, "approved"))
      .orderBy(desc(workshopsTable.createdAt));
  }),
});
