import { cookies } from "next/headers";
import { polarClient } from "@/services/auth/auth";
import { db } from "@/services/db/index";
import { orders, products, subscriptions } from "@/services/db/schema";
import {
  adminProcedure,
  authenticatedProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import type { SubscriptionProrationBehavior } from "@polar-sh/sdk/models/components/subscriptionprorationbehavior.js";
import { TRPCError } from "@trpc/server";
import { asc, desc, eq, or } from "drizzle-orm";
import { z } from "zod";

export const paymentsRouter = createTRPCRouter({
  getCustomerState: authenticatedProcedure
    .use(featureGuard("payments"))
    .query(async ({ ctx }) => {
      try {
        const [customerState, paidOrders] = await Promise.all([
          polarClient.customers.getStateExternal({
            externalId: ctx.session.user.id,
          }),
          db
            .select()
            .from(orders)
            .where(eq(orders.userId, ctx.session.user.id))
            .then((rows) => rows.filter((o) => o.status === "paid")),
        ]);

        const activeSub = customerState.activeSubscriptions?.[0] ?? null;

        const currentProduct = activeSub
          ? await db
              .select()
              .from(products)
              .where(eq(products.id, activeSub.productId))
              .limit(1)
              .then((result) => result[0] ?? null)
          : null;

        return {
          ...customerState,
          paidOrders,
          isUserHaveAccess:
            activeSub?.status === "active" ||
            activeSub?.status === "trialing" ||
            paidOrders.length > 0,
          currentProductId: activeSub?.productId ?? null,
          currentSubscriptionId: activeSub?.id ?? null,
          currentProduct,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch customer state",
          cause: error,
        });
      }
    }),
  /**
   * Fetches all products ordered by price amount
   * @returns Promise<Product[]> - Array of products sorted by price
   */
  getProducts: baseProcedure.use(featureGuard("payments")).query(async () => {
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
   * Updates an existing product
   * @param id - The ID of the product to update
   * @param product - Partial product data to update
   * @returns The updated product
   */
  updateProduct: adminProcedure
    .use(featureGuard("payments"))
    .input(
      z.object({
        id: z.string(),
        product: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          trialInterval: z.enum(["day", "week", "month", "year"]).optional(),
          trialIntervalCount: z.number().optional(),
          popular: z.boolean().optional(),
          slug: z.string().optional(),
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
   * Deletes a product by ID
   * @param id - The ID of the product to delete
   * @returns The deleted product
   */
  deleteProduct: adminProcedure
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

  /**
   * Creates a checkout session for a product
   * @param productId - The ID of the product to checkout
   * @param successUrl - Optional custom success URL
   * @param discountId - Optional discount code ID
   * @returns Checkout session response
   */
  createCheckout: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(
      z.object({
        productId: z.string(),
        successUrl: z.string().optional(),
        discountId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { productId, successUrl, discountId } = input;

        const checkoutIdPlaceholder = "{CHECKOUT_ID}";
        let url: string;
        if (successUrl) {
          const delimiter = successUrl.includes("?") ? "&" : "?";
          url = `${successUrl}${delimiter}checkout_id=${checkoutIdPlaceholder}`;
        } else {
          const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(
            /\/$/,
            ""
          );
          url = `${base}/success?checkout_id=${checkoutIdPlaceholder}`;
        }

        const response = await polarClient.checkouts.create({
          products: [productId],
          externalCustomerId: ctx.session.user.id,
          successUrl: url,
          discountId: discountId ?? undefined,
        });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to create checkout",
          cause: error,
        });
      }
    }),

  /**
   * Retrieves a checkout session by ID
   * @param checkoutId - The ID of the checkout session
   * @returns Promise<CheckoutSession> - Checkout session data
   */
  getCheckoutSession: baseProcedure
    .use(featureGuard("payments"))
    .input(z.string())
    .query(async ({ input }) => {
      try {
        const response = await polarClient.checkouts.get({
          id: input,
        });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to get checkout session",
          cause: error,
        });
      }
    }),

  /**
   * Switches a subscription to a different product/plan
   * @param subscriptionId - The ID of the subscription to update
   * @param toProductId - The ID of the new product/plan
   * @param prorationBehavior - Optional proration behavior
   * @returns Response from the subscription update
   */
  switchPlan: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(
      z.object({
        subscriptionId: z.string(),
        toProductId: z.string(),
        prorationBehavior: z
          .enum([
            "prorate",
            "invoice",
          ] as const satisfies readonly SubscriptionProrationBehavior[])
          .optional()
          .default("prorate"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { subscriptionId, toProductId, prorationBehavior } = input;

        // Fetch the current subscription to check its status
        const subscription = await polarClient.subscriptions.get({
          id: subscriptionId,
        });

        // Check if the subscription is in trial period
        if (subscription.status === "trialing") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Cannot switch plans while subscription is in trial period. Please wait until your trial ends or cancel and start a new subscription.",
          });
        }

        const response = await polarClient.subscriptions.update({
          id: subscriptionId,
          subscriptionUpdate: {
            productId: toProductId,
            prorationBehavior:
              prorationBehavior as SubscriptionProrationBehavior,
          },
        });
        return response;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to switch plan",
          cause: error,
        });
      }
    }),

  /**
   * Deletes a customer and clears all cookies
   * @param userId - The ID of the user/customer to delete
   * @returns Response from the customer deletion
   */
  deleteCustomer: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.string())
    .mutation(async ({ input }) => {
      try {
        const cookieStore = await cookies();
        await polarClient.customers.deleteExternal({
          externalId: input,
        });

        // Delete all cookies
        cookieStore.getAll().forEach((cookie) => {
          cookieStore.delete(cookie.name);
        });

        return true;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete customer",
          cause: error,
        });
      }
    }),

  /**
   * Fetches orders for a specific user by user ID or email
   * @param userId - The ID of the user to get orders for
   * @param email - The email of the user to get orders for
   * @returns Promise<Order[]> - Array of orders sorted by creation date (newest first)
   */
  getOrders: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(
      z.object({
        userId: z.string(),
        email: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { userId, email } = input;
        const ordersList = await db
          .select()
          .from(orders)
          .where(or(eq(orders.userId, userId), eq(orders.email, email)))
          .orderBy(desc(orders.createdAt));

        return ordersList;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to fetch orders",
          cause: error,
        });
      }
    }),

  /**
   * Fetches subscriptions for a specific user by user ID
   * @param userId - The ID of the user to get subscriptions for
   * @returns Promise<Subscription[]> - Array of subscriptions sorted by creation date (newest first)
   */
  getSubscriptions: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { userId } = input;

        const subscriptionsList = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, userId))
          .orderBy(desc(subscriptions.createdAt));

        return subscriptionsList;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch subscriptions",
          cause: error,
        });
      }
    }),

  /**
   * Generates a portal link for a customer
   * @returns Promise<CustomerSession> - Customer session data
   */
  generatePortalLink: authenticatedProcedure
    .use(featureGuard("payments"))
    .mutation(async ({ ctx }) => {
      try {
        const portalLink = await polarClient.customerSessions.create({
          externalCustomerId: ctx.session.user.id,
        });
        return portalLink;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to generate portal link",
          cause: error,
        });
      }
    }),
});
