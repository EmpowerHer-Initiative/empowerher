import { getStripeClient } from "@/services/auth/auth";
import { deleteCustomer } from "@/services/auth/auth-action";
import { db } from "@/services/db/index";
import { invoices, products, subscription, user } from "@/services/db/schema";
import { authenticatedProcedure, createTRPCRouter } from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import { TRPCError } from "@trpc/server";
import { desc, eq, or } from "drizzle-orm";
import { z } from "zod";

export const billingRouter = createTRPCRouter({
  getCustomerState: authenticatedProcedure
    .use(featureGuard("payments"))
    .query(async ({ ctx }) => {
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
      const stripe = getStripeClient();
      try {
        const session = await stripe.checkout.sessions.retrieve(
          input.sessionId
        );
        return {
          status: session.status,
          paymentStatus: session.payment_status,
          customerEmail: session.customer_details?.email ?? null,
        };
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Checkout session not found",
        });
      }
    }),

  listInvoices: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.object({ userId: z.string(), email: z.string() }))
    .query(async ({ input }) => {
      const { userId, email } = input;
      return db
        .select({
          id: invoices.id,
          userId: invoices.userId,
          email: invoices.email,
          productId: invoices.productId,
          subscriptionId: invoices.subscriptionId,
          billingName: invoices.billingName,
          billingReason: invoices.billingReason,
          totalAmount: invoices.totalAmount,
          invoiceNumber: invoices.invoiceNumber,
          status: invoices.status,
          discountAmount: invoices.discountAmount,
          currency: invoices.currency,
          hostedInvoiceUrl: invoices.hostedInvoiceUrl,
          pdfUrl: invoices.pdfUrl,
          createdAt: invoices.createdAt,
          updatedAt: invoices.updatedAt,
          metadata: invoices.metadata,
        })
        .from(invoices)
        .where(or(eq(invoices.userId, userId), eq(invoices.email, email)))
        .orderBy(desc(invoices.createdAt));
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
      const stripe = getStripeClient();
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
        const customer = await stripe.customers.create({
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

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: priceIds.map((id) => ({ price: id, quantity: 1 })),
        success_url:
          successUrl || `${base}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${base}/`,
      });

      if (!session.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session URL",
        });
      }

      return { url: session.url };
    }),

  createPortalSession: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.object({ returnUrl: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const stripe = getStripeClient();

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

      const session = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: input.returnUrl
          ? `${base}${input.returnUrl}`
          : `${base}/settings`,
      });

      return { url: session.url };
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
      const stripe = getStripeClient();

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

      const stripeSub = await stripe.subscriptions.retrieve(
        input.subscriptionId
      );
      const itemId = stripeSub.items.data[0]?.id;

      if (!itemId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No subscription item found",
        });
      }

      const updated = await stripe.subscriptions.update(input.subscriptionId, {
        items: [{ id: itemId, price: input.newPriceId }],
        proration_behavior: "create_prorations",
      });

      return { subscriptionId: updated.id, status: updated.status };
    }),

  getSubscriptionDetails: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.object({ subscriptionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const stripe = getStripeClient();

      // Verify ownership via local DB
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

      // Fetch live from Stripe with expanded product data
      const stripeSub = await stripe.subscriptions.retrieve(
        input.subscriptionId,
        { expand: ["items.data.price.product"] }
      );

      return {
        id: stripeSub.id,
        status: stripeSub.status,
        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
        cancelAt: stripeSub.cancel_at,
        canceledAt: stripeSub.canceled_at,
        currentPeriodStart:
          stripeSub.items.data[0]?.current_period_start ?? null,
        currentPeriodEnd: stripeSub.items.data[0]?.current_period_end ?? null,
        items: stripeSub.items.data.map((item) => {
          const product =
            typeof item.price.product === "object" &&
            "name" in item.price.product
              ? item.price.product
              : null;

          return {
            id: item.id,
            productId:
              typeof item.price.product === "string"
                ? item.price.product
                : (product?.id ?? null),
            productName: product?.name ?? null,
            priceId: item.price.id,
            unitAmount: item.price.unit_amount ?? 0,
            currency: item.price.currency,
            interval: item.price.recurring?.interval ?? null,
            intervalCount: item.price.recurring?.interval_count ?? null,
            quantity: item.quantity ?? 1,
          };
        }),
      };
    }),

  deleteCustomer: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.string())
    .mutation(async ({ input }) => {
      const stripe = getStripeClient();

      const dbUser = await db
        .select()
        .from(user)
        .where(eq(user.id, input))
        .limit(1)
        .then((res) => res[0]);

      if (dbUser?.stripeCustomerId) {
        await stripe.customers.del(dbUser.stripeCustomerId);
      }

      await deleteCustomer(dbUser?.email ?? "");

      return true;
    }),
});
