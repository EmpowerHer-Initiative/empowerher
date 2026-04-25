import { listPromotionCodes } from "@/services/payments";
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
    return listPromotionCodes({ limit: 50 });
  }),

  verify: baseProcedure
    .use(featureGuard("payments"))
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const codes = await listPromotionCodes({
        code: input.code,
        active: true,
        limit: 1,
      });

      const promoCode = codes[0];
      if (!promoCode) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discount code not found",
        });
      }

      if (
        promoCode.expiresAt &&
        new Date(promoCode.expiresAt * 1000) < new Date()
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Discount code has expired",
        });
      }

      if (
        promoCode.maxRedemptions &&
        promoCode.timesRedeemed >= promoCode.maxRedemptions
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
