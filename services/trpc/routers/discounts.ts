import { stripeClient } from "@/services/auth/auth";
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const discountsRouter = createTRPCRouter({
  getAll: adminProcedure.use(featureGuard("discounts")).query(async () => {
    try {
      const promotionCodes = await stripeClient.promotionCodes.list({
        limit: 50,
        expand: ["data.coupon"],
      });
      return promotionCodes.data;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch promotion codes",
        cause: error,
      });
    }
  }),

  verifyCode: baseProcedure
    .use(featureGuard("discounts"))
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      try {
        const promotionCodes = await stripeClient.promotionCodes.list({
          code: input.code,
          active: true,
          limit: 1,
        });

        const promoCode = promotionCodes.data[0];
        if (!promoCode) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Discount code not found",
          });
        }

        // Check expiration
        if (
          promoCode.expires_at &&
          new Date(promoCode.expires_at * 1000) < new Date()
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Discount code has expired",
          });
        }

        // Check max redemptions
        if (
          promoCode.max_redemptions &&
          promoCode.times_redeemed >= promoCode.max_redemptions
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Discount code has reached the maximum number of uses",
          });
        }

        return promoCode;
      } catch (error) {
        throw new TRPCError({
          code:
            error instanceof TRPCError ? error.code : "INTERNAL_SERVER_ERROR",
          message:
            error instanceof TRPCError
              ? error.message
              : "Failed to verify discount code",
          cause: error instanceof TRPCError ? error.cause : undefined,
        });
      }
    }),
});

export type DiscountsRouter = typeof discountsRouter;
