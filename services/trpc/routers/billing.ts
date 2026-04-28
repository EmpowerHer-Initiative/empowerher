import { deleteCustomer as deleteCustomerAction } from "@/services/auth/auth-action";
import { db } from "@/services/db/index";
import { orders, products, subscription, user } from "@/services/db/schema";
import {
  createCheckoutSession,
  createCustomer,
  createPortalSession,
  deleteCustomer,
  getSubscriptionDetails,
  retrieveCheckoutSession,
  switchPlan,
} from "@/services/payments";
import { authenticatedProcedure, createTRPCRouter } from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const billingRouter = createTRPCRouter({
  getCustomerState: authenticatedProcedure
    .use(featureGuard("payments"))
    .query(async ({ ctx }) => {
      const [subs, paidOrders] = await Promise.all([
        db
          .select()
          .from(subscription)
          .where(eq(subscription.referenceId, ctx.session.user.id)),
        db
          .select()
          .from(orders)
          .where(eq(orders.userId, ctx.session.user.id))
          .then((rows) =>
            rows.filter(
              (o) => o.status === "paid" || o.status === "partially_refunded"
            )
          ),
      ]);

      const activeSub = subs.find(
        (s) => s.status === "active" || s.status === "trialing"
      );

      return {
        subscriptions: subs,
        activeSubscription: activeSub ?? null,
        paidOrders,
        isUserHaveAccess: !!activeSub || paidOrders.length > 0,
        currentPlan: activeSub?.plan ?? null,
        currentSubscriptionId: activeSub?.id ?? null,
      };
    }),

  listSubscriptions: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const subs = await db
        .select({
          subscription: subscription,
          productName: products.name,
        })
        .from(subscription)
        .leftJoin(products, eq(products.priceId, subscription.plan))
        .where(eq(subscription.referenceId, input.userId))
        .orderBy(desc(subscription.periodStart));

      return subs.map((s) => ({
        ...s.subscription,
        productName: s.productName,
      }));
    }),

  verifyCheckout: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      try {
        return await retrieveCheckoutSession(input.sessionId);
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Checkout session not found",
        });
      }
    }),

  listOrders: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const rows = await db
        .select({
          order: orders,
          productName: products.name,
        })
        .from(orders)
        .leftJoin(products, eq(products.id, orders.productId))
        .where(eq(orders.userId, input.userId))
        .orderBy(desc(orders.createdAt));

      return rows.map((r) => ({
        ...r.order,
        productName: r.productName,
      }));
    }),

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
      const { priceIds, successUrl, cancelUrl } = input;

      const dbUser = await db
        .select()
        .from(user)
        .where(eq(user.id, ctx.session.user.id))
        .limit(1)
        .then((res) => res[0]);

      let customerId = dbUser?.stripeCustomerId;

      if (!customerId) {
        const result = await createCustomer({
          email: ctx.session.user.email,
          name: ctx.session.user.name,
          metadata: { userId: ctx.session.user.id },
        });
        customerId = result.customerId;
        await db
          .update(user)
          .set({ stripeCustomerId: customerId })
          .where(eq(user.id, ctx.session.user.id));
      }

      // Determine mode based on product's recurring status
      const [product] = await db
        .select({ isRecurring: products.isRecurring })
        .from(products)
        .where(eq(products.priceId, priceIds[0]))
        .limit(1);

      const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

      return createCheckoutSession({
        customerId,
        priceIds,
        mode: product?.isRecurring ? "subscription" : "payment",
        successUrl:
          successUrl || `${base}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: cancelUrl || `${base}/`,
      });
    }),

  createPortalSession: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.object({ returnUrl: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const dbUser = await db
        .select()
        .from(user)
        .where(eq(user.id, ctx.session.user.id))
        .limit(1)
        .then((res) => res[0]);

      if (!dbUser?.stripeCustomerId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No Stripe customer found for this user",
        });
      }

      const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

      return createPortalSession({
        customerId: dbUser.stripeCustomerId,
        returnUrl: input.returnUrl
          ? `${base}${input.returnUrl}`
          : `${base}/settings`,
      });
    }),

  switchPlan: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(
      z.object({
        subscriptionId: z.string(),
        newPriceId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const sub = await db
        .select()
        .from(subscription)
        .where(eq(subscription.stripeSubscriptionId, input.subscriptionId))
        .limit(1)
        .then((res) => res[0]);

      if (!sub || sub.referenceId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      try {
        return await switchPlan({
          subscriptionId: input.subscriptionId,
          newPriceId: input.newPriceId,
        });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to switch plan",
        });
      }
    }),

  getSubscriptionDetails: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.object({ subscriptionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const sub = await db
        .select()
        .from(subscription)
        .where(eq(subscription.stripeSubscriptionId, input.subscriptionId))
        .limit(1)
        .then((r) => r[0]);

      if (!sub || sub.referenceId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      return getSubscriptionDetails(input.subscriptionId);
    }),

  deleteCustomer: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.string())
    .mutation(async ({ input }) => {
      const dbUser = await db
        .select()
        .from(user)
        .where(eq(user.id, input))
        .limit(1)
        .then((res) => res[0]);

      if (dbUser?.stripeCustomerId) {
        await deleteCustomer(dbUser.stripeCustomerId);
      }

      await deleteCustomerAction(dbUser?.email ?? "");

      return true;
    }),
});
