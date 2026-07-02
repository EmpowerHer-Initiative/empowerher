import { cacheLife } from "next/cache";
import { asc } from "drizzle-orm";

import { db } from "@/services/db/index";
import { resourcesTable } from "@/services/db/schema";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";

export const resourcesRouter = createTRPCRouter({
  list: baseProcedure.query(async () => {
    "use cache";
    cacheLife("hours");

    return db.select().from(resourcesTable).orderBy(asc(resourcesTable.id));
  }),
});
