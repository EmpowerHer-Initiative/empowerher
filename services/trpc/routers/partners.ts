import { cacheLife, cacheTag } from "next/cache";
import { asc } from "drizzle-orm";

import { db } from "@/services/db/index";
import { partnersTable } from "@/services/db/schema";
import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";

export const partnersRouter = createTRPCRouter({
  list: baseProcedure.query(async () => {
    "use cache";
    cacheLife("max");
    cacheTag("partners");

    return db.select().from(partnersTable).orderBy(asc(partnersTable.index));
  }),
});
