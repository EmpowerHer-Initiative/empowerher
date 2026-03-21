import { createTRPCRouter } from "@/services/trpc/init";

import { adminOverviewRouter } from "./overview";
import { adminUsersRouter } from "./users";

export const adminRouter = createTRPCRouter({
  overview: adminOverviewRouter,
  users: adminUsersRouter,
});
