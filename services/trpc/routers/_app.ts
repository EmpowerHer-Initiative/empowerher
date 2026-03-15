import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { createTRPCRouter } from "../init";
import { adminRouter } from "./admin/_index";
import { discountsRouter } from "./discounts";
import { paymentsRouter } from "./payments";
import { sessionsRouter } from "./sessions";
import { uploadRouter } from "./upload/_index";
import { userRouter } from "./user";
import { verificationRouter } from "./verification";

export const appRouter = createTRPCRouter({
  sessions: sessionsRouter,
  user: userRouter,
  verification: verificationRouter,
  discounts: discountsRouter,
  admin: adminRouter,
  payments: paymentsRouter,
  upload: uploadRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
