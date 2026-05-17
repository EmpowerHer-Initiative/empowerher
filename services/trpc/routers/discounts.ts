import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const getPolarClient = () =>
  import("@/services/auth/auth").then((m) => m.polarClient);

export const discountsRouter = createTRPCRouter({
  list: adminProcedure.use(featureGuard("payments")).query(async () => {
    const polarClient = await getPolarClient();
    const result = await polarClient.discounts.list({});
    return result.result.items;
  }),

  verify: baseProcedure
    .use(featureGuard("payments"))
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const polarClient = await getPolarClient();
      const result = await polarClient.discounts.list({});
      const discount = result.result.items.find((d) => d.code === input.code);

      if (!discount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discount code not found",
        });
      }

      return discount;
    }),
});

export type DiscountsRouter = typeof discountsRouter;
