import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { createTRPCRouter } from "../init";
import { adminRouter } from "./admin/_index";
import { authRouter } from "./auth";
import { commentsRouter } from "./comments";
import { contactRouter } from "./contact";
import { featuredWritingsRouter } from "./featured-writings";
import { logsRouter } from "./logs";
import { newsletterRouter } from "./newsletter";
import { partnersRouter } from "./partners";
import { resourcesRouter } from "./resources";
import { staffRouter } from "./staff/_index";
import { teachersRouter } from "./teachers";
import { usersRouter } from "./users";
import { verificationRouter } from "./verification";
import { workshopsRouter } from "./workshops";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  contact: contactRouter,
  comments: commentsRouter,
  users: usersRouter,
  logs: logsRouter,
  newsletter: newsletterRouter,
  verification: verificationRouter,
  partners: partnersRouter,
  resources: resourcesRouter,
  teachers: teachersRouter,
  workshops: workshopsRouter,
  featuredWritings: featuredWritingsRouter,
  admin: adminRouter,
  staff: staffRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
