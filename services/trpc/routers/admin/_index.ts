import { createTRPCRouter } from "@/services/trpc/init";

import { adminOverviewRouter } from "./overview";

export const adminRouter = createTRPCRouter({
  overview: adminOverviewRouter,
});
