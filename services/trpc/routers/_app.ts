import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { createTRPCRouter } from "../init";
import { adminRouter } from "./admin/_index";
import { authRouter } from "./auth";
import { commentsRouter } from "./comments";
import { contactRouter } from "./contact";
import { discountsRouter } from "./discounts";
import { filesRouter } from "./files";
import { logsRouter } from "./logs";
import { paymentsRouter } from "./payments";
import { productsRouter } from "./products";
import { staffRouter } from "./staff/_index";
import { usersRouter } from "./users";
import { verificationRouter } from "./verification";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  contact: contactRouter,
  comments: commentsRouter,
  users: usersRouter,
  products: productsRouter,
  discounts: discountsRouter,
  payments: paymentsRouter,
  files: filesRouter,
  logs: logsRouter,
  verification: verificationRouter,
  admin: adminRouter,
  staff: staffRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
