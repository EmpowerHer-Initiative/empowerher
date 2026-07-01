import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { createTRPCRouter } from "../init";
import { adminRouter } from "./admin/_index";
import { authRouter } from "./auth";
import { commentsRouter } from "./comments";
import { contactRouter } from "./contact";
import { filesRouter } from "./files";
import { logsRouter } from "./logs";
import { newsletterRouter } from "./newsletter";
import { staffRouter } from "./staff/_index";
import { usersRouter } from "./users";
import { verificationRouter } from "./verification";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  contact: contactRouter,
  comments: commentsRouter,
  users: usersRouter,
  files: filesRouter,
  logs: logsRouter,
  newsletter: newsletterRouter,
  verification: verificationRouter,
  admin: adminRouter,
  staff: staffRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
