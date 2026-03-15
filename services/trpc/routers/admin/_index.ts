import { createTRPCRouter } from "@/services/trpc/init";

import { adminUsersRouter } from "./users";

export const adminRouter = createTRPCRouter({
  users: adminUsersRouter,
});
