import { createTRPCRouter } from "@/services/trpc/init";

import { adminAllStudentsRouter } from "./all-students";
import { adminCommentsRouter } from "./comments";
import { adminFeaturedWritingsRouter } from "./featured-writings";
import { adminResourcesRouter } from "./resources";

export const adminRouter = createTRPCRouter({
  comments: adminCommentsRouter,
  resources: adminResourcesRouter,
  featuredWritings: adminFeaturedWritingsRouter,
  allStudents: adminAllStudentsRouter,
});
