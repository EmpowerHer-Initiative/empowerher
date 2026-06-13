import { createTRPCRouter } from "@/services/trpc/init";

import { adminAllStudentsRouter } from "./all-students";
import { adminCommentsRouter } from "./comments";
import { adminFeaturedWritingsRouter } from "./featured-writings";
import { adminOverviewRouter } from "./overview";
import { adminResourcesRouter } from "./resources";

export const adminRouter = createTRPCRouter({
  overview: adminOverviewRouter,
  comments: adminCommentsRouter,
  resources: adminResourcesRouter,
  featuredWritings: adminFeaturedWritingsRouter,
  allStudents: adminAllStudentsRouter,
});
