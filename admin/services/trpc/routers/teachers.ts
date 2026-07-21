import { cacheLife, cacheTag } from "next/cache";
import { asc } from "drizzle-orm";

import { CACHE_TAGS } from "@/services/cache/tags";
import { db } from "@/services/db/index";
import { teachersTable } from "@/services/db/schema";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";

export const teachersRouter = createTRPCRouter({
  list: baseProcedure.query(async () => {
    "use cache";
    cacheLife("max");
    cacheTag(CACHE_TAGS.teachers);

    return db
      .select({
        id: teachersTable.id,
        name: teachersTable.name,
        headTitle: teachersTable.headTitle,
        avatar: teachersTable.avatar,
        role: teachersTable.role,
      })
      .from(teachersTable)
      .orderBy(asc(teachersTable.index));
  }),
});
