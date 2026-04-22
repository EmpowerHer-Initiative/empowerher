import { cookies } from "next/headers";
import { stripeClient } from "@/services/auth/auth";
import { deleteCustomer } from "@/services/auth/auth-action";
import { db } from "@/services/db/index";
import { invoices, products, subscription, user } from "@/services/db/schema";
import {
  adminProcedure,
  authenticatedProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import { TRPCError } from "@trpc/server";
import { asc, desc, eq, or } from "drizzle-orm";
import { z } from "zod";

export const paymentsRouter = createTRPCRouter({
  /**
   * Fetches active subscriptions for the current user
   */
  getCustomerState: authenticatedProcedure
    .use(featureGuard("payments"))
    .query(async ({ ctx }) => {
      try {
        const subs = await db
          .select()
          .from(subscription)
          .where(eq(subscription.referenceId, ctx.session.user.id));

        const activeSub = subs.find(
          (s) => s.status === "active" || s.status === "trialing"
        );

        return {
          subscriptions: subs,
          activeSubscription: activeSub ?? null,
          isUserHaveAccess: !!activeSub,
          currentPlan: activeSub?.plan ?? null,
          currentSubscriptionId: activeSub?.id ?? null,
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
   * Fetches all products from local DB, sorted by price
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
   * Updates an existing product in local DB
   */
  updateProduct: adminProcedure
    .use(featureGuard("admin.products"))
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
  deleteProduct: adminProcedure
    .use(featureGuard("admin.products"))
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
   * Creates a Stripe checkout session
   */
  createCheckout: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(
      z.object({
        priceIds: z.array(z.string()).min(1),
        successUrl: z.string().optional(),
        cancelUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { priceIds, successUrl, cancelUrl } = input;

        // Get or create Stripe customer ID
        const dbUser = await db
          .select()
          .from(user)
          .where(eq(user.id, ctx.session.user.id))
          .limit(1)
          .then((res) => res[0]);

        let customerId = dbUser?.stripeCustomerId;

        if (!customerId) {
          const customer = await stripeClient.customers.create({
            email: ctx.session.user.email,
            name: ctx.session.user.name,
            metadata: { userId: ctx.session.user.id },
          });
          customerId = customer.id;
          await db
            .update(user)
            .set({ stripeCustomerId: customer.id })
            .where(eq(user.id, ctx.session.user.id));
        }

        const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

        const session = await stripeClient.checkout.sessions.create({
          customer: customerId,
          mode: "subscription",
          line_items: priceIds.map((id) => ({ price: id, quantity: 1 })),
          success_url: successUrl || `${base}/success`,
          cancel_url: cancelUrl || `${base}/`,
        });

        if (!session.url) {
          throw new Error("Failed to create checkout session URL");
        }

        return { url: session.url };
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
   * Fetches invoices for a specific user by user ID or email
   */
  getInvoices: authenticatedProcedure
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
        const invoicesList = await db
          .select()
          .from(invoices)
          .where(or(eq(invoices.userId, userId), eq(invoices.email, email)))
          .orderBy(desc(invoices.createdAt));

        return invoicesList;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to fetch invoices",
          cause: error,
        });
      }
    }),

  /**
   * Fetches subscriptions for a specific user by user ID
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
        const subs = await db
          .select()
          .from(subscription)
          .where(eq(subscription.referenceId, input.userId))
          .orderBy(desc(subscription.periodStart));

        return subs;
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
   * Deletes a customer from Stripe and clears all cookies
   */
  deleteCustomer: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.string())
    .mutation(async ({ input }) => {
      try {
        const cookieStore = await cookies();

        const dbUser = await db
          .select()
          .from(user)
          .where(eq(user.id, input))
          .limit(1)
          .then((res) => res[0]);

        if (dbUser?.stripeCustomerId) {
          await stripeClient.customers.del(dbUser.stripeCustomerId);
        }

        await deleteCustomer(dbUser?.email ?? "");

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
   * Public: lists active products from local DB for pricing pages
   */
  listProducts: baseProcedure.use(featureGuard("payments")).query(async () => {
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
});
