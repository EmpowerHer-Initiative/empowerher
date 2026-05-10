import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { createTRPCRouter } from "../init";
import { adminRouter } from "./admin/_index";
import { authRouter } from "./auth";
import { billingRouter } from "./billing";
import { contactRouter } from "./contact";
import { discountsRouter } from "./discounts";
import { filesRouter } from "./files";
import { paymentsRouter } from "./payments";
import { productsRouter } from "./products";
import { usersRouter } from "./users";
import { verificationRouter } from "./verification";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  users: usersRouter,
  products: productsRouter,
  billing: billingRouter,
  discounts: discountsRouter,
  payments: paymentsRouter,
  files: filesRouter,
  contact: contactRouter,
  verification: verificationRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
