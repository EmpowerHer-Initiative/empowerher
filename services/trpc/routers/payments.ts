import { cookies } from "next/headers";
import { removeCustomer } from "@/services/auth/actions";
import { polarClient } from "@/services/auth/auth";
import { db } from "@/services/db/index";
import { orders, products, subscriptions, user } from "@/services/db/schema";
import {
  cancelSubscription,
  deleteCustomerByEmail,
  getSubscriptionDetails,
} from "@/services/payments";
import {
  adminProcedure,
  authenticatedProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import type { SubscriptionProrationBehavior } from "@polar-sh/sdk/models/components/subscriptionprorationbehavior.js";
import { ResourceNotFound } from "@polar-sh/sdk/models/errors/resourcenotfound.js";
import { TRPCError } from "@trpc/server";
import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const paymentsRouter = createTRPCRouter({
  // ─── Customer State ──────────────────────────────────────────────
  getCustomerState: authenticatedProcedure
    .use(featureGuard("payments"))
    .query(async ({ ctx }) => {
      let customerState;
      try {
        customerState = await polarClient.customers.getStateExternal({
          externalId: ctx.session.user.id,
        });
      } catch (err) {
        if (err instanceof ResourceNotFound) {
          const paidOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.userId, ctx.session.user.id))
            .then((rows) => rows.filter((o) => o.status === "paid"));

          return {
            activeSubscriptions: [] as never[],
            paidOrders,
            isUserHaveAccess: paidOrders.length > 0,
            currentProductId: null,
            currentSubscriptionId: null,
            currentProduct: null,
          };
        }
        throw err;
      }

      const paidOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, ctx.session.user.id))
        .then((rows) => rows.filter((o) => o.status === "paid"));

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
    }),

  // ─── Products ────────────────────────────────────────────────────
  getProducts: baseProcedure.use(featureGuard("payments")).query(async () => {
    return db.select().from(products).orderBy(asc(products.priceAmount));
  }),

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
      const [updated] = await db
        .update(products)
        .set({ ...input.product, updatedAt: new Date() })
        .where(eq(products.id, input.id))
        .returning();
      return updated;
    }),

  deleteProduct: adminProcedure
    .use(featureGuard("payments"))
    .input(z.string())
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(products)
        .where(eq(products.id, input))
        .returning();
      return deleted;
    }),

  // ─── Checkout ────────────────────────────────────────────────────
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
      const { productId, successUrl, discountId } = input;

      // Ensure customer exists in Polar, create if not found
      try {
        await polarClient.customers.getExternal({
          externalId: ctx.session.user.id,
        });
      } catch (err) {
        if (err instanceof ResourceNotFound) {
          await polarClient.customers.create({
            email: ctx.session.user.email,
            name: ctx.session.user.name ?? undefined,
            externalId: ctx.session.user.id,
          });
        } else {
          throw err;
        }
      }

      const checkoutIdPlaceholder = "{CHECKOUT_ID}";
      let url: string;
      if (successUrl) {
        const delimiter = successUrl.includes("?") ? "&" : "?";
        url = `${successUrl}${delimiter}checkout_id=${checkoutIdPlaceholder}`;
      } else {
        const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
        url = `${base}/success?checkout_id=${checkoutIdPlaceholder}`;
      }

      return polarClient.checkouts.create({
        products: [productId],
        externalCustomerId: ctx.session.user.id,
        successUrl: url,
        discountId: discountId ?? undefined,
      });
    }),

  getCheckoutSession: baseProcedure
    .use(featureGuard("payments"))
    .input(z.string())
    .query(async ({ input }) => {
      return polarClient.checkouts.get({ id: input });
    }),

  // ─── Subscriptions ───────────────────────────────────────────────
  getSubscriptions: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (
        input.userId !== ctx.session.user.id &&
        ctx.session.user.role !== "admin"
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, input.userId))
        .orderBy(desc(subscriptions.createdAt));
    }),

  listSubscriptions: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (
        input.userId !== ctx.session.user.id &&
        ctx.session.user.role !== "admin"
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const subs = await db
        .select({
          subscription: subscriptions,
          productName: products.name,
        })
        .from(subscriptions)
        .leftJoin(products, eq(products.id, subscriptions.productId))
        .where(eq(subscriptions.userId, input.userId))
        .orderBy(desc(subscriptions.createdAt));

      return subs.map((s) => ({
        ...s.subscription,
        productName: s.productName,
      }));
    }),

  getSubscriptionDetails: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.object({ subscriptionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const sub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, input.subscriptionId))
        .limit(1)
        .then((r) => r[0]);

      if (!sub || sub.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return getSubscriptionDetails(input.subscriptionId);
    }),

  cancelSubscription: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.object({ subscriptionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const sub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, input.subscriptionId))
        .limit(1)
        .then((r) => r[0]);

      if (!sub || sub.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (sub.status === "canceled") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Subscription is already canceled",
        });
      }

      await cancelSubscription(input.subscriptionId);
      return { success: true };
    }),

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
    .mutation(async ({ input, ctx }) => {
      const { subscriptionId, toProductId, prorationBehavior } = input;

      // Verify ownership via local DB
      const sub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, subscriptionId))
        .limit(1)
        .then((r) => r[0]);

      if (!sub || sub.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Check trial status from Polar
      const subscription = await polarClient.subscriptions.get({
        id: subscriptionId,
      });

      if (subscription.status === "trialing") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot switch plans while subscription is in trial period.",
        });
      }

      return polarClient.subscriptions.update({
        id: subscriptionId,
        subscriptionUpdate: {
          productId: toProductId,
          prorationBehavior: prorationBehavior as SubscriptionProrationBehavior,
        },
      });
    }),

  // ─── Orders ──────────────────────────────────────────────────────
  listOrders: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (
        input.userId !== ctx.session.user.id &&
        ctx.session.user.role !== "admin"
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const dbRows = await db
        .select({
          order: orders,
          productName: products.name,
        })
        .from(orders)
        .leftJoin(products, eq(products.id, orders.productId))
        .where(eq(orders.userId, input.userId))
        .orderBy(desc(orders.createdAt));

      return dbRows.map((r) => ({
        id: r.order.id,
        totalAmount: r.order.totalAmount,
        status: r.order.status,
        productName: r.productName,
        billingReason: r.order.billingReason,
        invoiceNumber: r.order.invoiceNumber,
        discountAmount: r.order.discountAmount,
        metadata: r.order.metadata,
        createdAt: r.order.createdAt,
      }));
    }),

  // ─── Portal ──────────────────────────────────────────────────────
  generatePortalLink: authenticatedProcedure
    .use(featureGuard("payments"))
    .mutation(async ({ ctx }) => {
      return polarClient.customerSessions.create({
        externalCustomerId: ctx.session.user.id,
      });
    }),

  // ─── Customer Deletion ──────────────────────────────────────────
  deleteCustomer: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      if (input !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const cookieStore = await cookies();

      const dbUser = await db
        .select()
        .from(user)
        .where(eq(user.id, input))
        .limit(1)
        .then((res) => res[0]);

      // Delete from Polar
      if (dbUser?.email) {
        try {
          await deleteCustomerByEmail(dbUser.email);
        } catch {
          // Customer may not exist in Polar yet
        }
      }

      // Delete from local DB
      await removeCustomer(dbUser?.email ?? "");

      // Clear cookies
      cookieStore.getAll().forEach((cookie) => {
        cookieStore.delete(cookie.name);
      });

      return true;
    }),
});
