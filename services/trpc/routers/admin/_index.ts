import { createTRPCRouter } from "@/services/trpc/init";

import { adminMediaRouter } from "./media";
import { adminOverviewRouter } from "./overview";
import { adminUsersRouter } from "./users";

export const adminRouter = createTRPCRouter({
  overview: adminOverviewRouter,
  users: adminUsersRouter,
  media: adminMediaRouter,
});
