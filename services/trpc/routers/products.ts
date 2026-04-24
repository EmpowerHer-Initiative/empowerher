import { db } from "@/services/db/index";
import { products } from "@/services/db/schema";
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

export const productsRouter = createTRPCRouter({
  list: baseProcedure.use(featureGuard("payments")).query(async () => {
    return db
      .select()
      .from(products)
      .where(eq(products.isArchived, false))
      .orderBy(asc(products.priceAmount));
  }),

  listAll: adminProcedure.use(featureGuard("payments")).query(async () => {
    return db.select().from(products).orderBy(asc(products.priceAmount));
  }),

  update: adminProcedure
    .use(featureGuard("payments"))
    .input(
      z.object({
        id: z.string(),
        product: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          popular: z.boolean().optional(),
          priceAmount: z.number().optional(),
          priceCurrency: z.string().optional(),
          recurringInterval: z
            .enum(["day", "week", "month", "year"])
            .optional(),
          isRecurring: z.boolean().optional(),
          isArchived: z.boolean().optional(),
          metadata: z.any().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { id, product } = input;
      const [updatedProduct] = await db
        .update(products)
        .set({
          ...product,
          updatedAt: new Date(),
        })
        .where(eq(products.id, id))
        .returning();
      return updatedProduct;
    }),

  delete: adminProcedure
    .use(featureGuard("payments"))
    .input(z.string())
    .mutation(async ({ input }) => {
      const [deletedProduct] = await db
        .delete(products)
        .where(eq(products.id, input))
        .returning();
      return deletedProduct;
    }),
});
