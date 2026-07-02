import { cacheLife } from "next/cache";
import { asc } from "drizzle-orm";

import { db } from "@/services/db/index";
import { featuredWritingsTable } from "@/services/db/schema";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";

export const featuredWritingsRouter = createTRPCRouter({
  list: baseProcedure.query(async () => {
    "use cache";
    cacheLife("hours");

    return db
      .select()
      .from(featuredWritingsTable)
      .orderBy(asc(featuredWritingsTable.id));
  }),
});
