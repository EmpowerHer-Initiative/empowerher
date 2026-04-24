import { db } from "@/services/db/index";
import { products } from "@/services/db/schema";
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import { TRPCError } from "@trpc/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

export const productsRouter = createTRPCRouter({
  /**
   * Public: lists active products from local DB for pricing pages
   */
  list: baseProcedure.use(featureGuard("payments")).query(async () => {
    try {
      const productsList = await db
        .select()
        .from(products)
        .where(eq(products.isArchived, false))
        .orderBy(asc(products.priceAmount));
      return productsList;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to list products",
        cause: error,
      });
    }
  }),

  /**
   * Fetches all products from local DB, sorted by price
   */
  listAll: baseProcedure.use(featureGuard("payments")).query(async () => {
    try {
      const productsList = await db
        .select()
        .from(products)
        .orderBy(asc(products.priceAmount));
      return productsList;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to fetch products",
        cause: error,
      });
    }
  }),

  /**
   * Updates an existing product in local DB
   */
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
      try {
        const { id, ...productData } = input;
        const [updatedProduct] = await db
          .update(products)
          .set({
            ...productData,
            updatedAt: new Date(),
          })
          .where(eq(products.id, id))
          .returning();
        return updatedProduct;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to update product",
          cause: error,
        });
      }
    }),

  /**
   * Deletes a product from local DB
   */
  delete: adminProcedure
    .use(featureGuard("payments"))
    .input(z.string())
    .mutation(async ({ input }) => {
      try {
        const [deletedProduct] = await db
          .delete(products)
          .where(eq(products.id, input))
          .returning();
        return deletedProduct;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to delete product",
          cause: error,
        });
      }
    }),
});
