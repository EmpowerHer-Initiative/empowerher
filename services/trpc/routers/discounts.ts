import { getStripeClient } from "@/services/auth/auth";
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const discountsRouter = createTRPCRouter({
  list: adminProcedure.use(featureGuard("payments")).query(async () => {
    const stripe = getStripeClient();
    const promotionCodes = await stripe.promotionCodes.list({
      limit: 50,
      expand: ["data.coupon"],
    });
    return promotionCodes.data;
  }),

  verify: baseProcedure
    .use(featureGuard("payments"))
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const stripe = getStripeClient();
      const promotionCodes = await stripe.promotionCodes.list({
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

      if (
        promoCode.expires_at &&
        new Date(promoCode.expires_at * 1000) < new Date()
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Discount code has expired",
        });
      }

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
    }),
});

export type DiscountsRouter = typeof discountsRouter;
