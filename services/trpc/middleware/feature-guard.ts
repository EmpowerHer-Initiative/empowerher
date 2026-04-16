import { createMiddleware } from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";

import { isFeatureEnabled, type FeatureKey } from "@/config/features";

export const featureGuard = (feature: FeatureKey) =>
  createMiddleware(async ({ next }) => {
    if (!isFeatureEnabled(feature)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "This feature is not currently available.",
      });
    }
    return next();
  });
