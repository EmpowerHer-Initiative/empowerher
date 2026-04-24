import { stripeClient } from "@/services/auth/auth";
import { db } from "@/services/db/index";
import {
  invoices,
  products,
  refunds,
  subscription,
  user,
} from "@/services/db/schema";
import { and, eq, sql } from "drizzle-orm";
import type Stripe from "stripe";

import { deleteFile } from "../trpc/routers/files-action";

// ----------------------------
// 📦 Products
// ----------------------------

/**
 * Resolves the default price from a Stripe product.
 * In webhooks, default_price can be a string ID or an expanded Price object.
 */
async function resolvePrice(
  defaultPrice: string | Stripe.Price | null | undefined
): Promise<Stripe.Price | null> {
  if (!defaultPrice) return null;
  if (typeof defaultPrice === "object") return defaultPrice;
  // It's a string ID — fetch the full price from Stripe
  return stripeClient.prices.retrieve(defaultPrice);
}

export const createProduct = async (product: Stripe.Product) => {
  const price = await resolvePrice(product.default_price);
  await db
    .insert(products)
    .values({
      id: product.id,
      name: product.name,
      description: product.description ?? null,
      popular: false,
      priceId: price?.id ?? null,
      priceAmount: price?.unit_amount ?? 0,
      priceCurrency: price?.currency ?? "usd",
      recurringInterval: price?.recurring?.interval ?? null,
      isRecurring: !!price?.recurring,
      isArchived: !product.active,
      metadata: product.metadata ?? {},
      createdAt: new Date(product.created * 1000),
      updatedAt: new Date(product.updated * 1000),
    })
    .onConflictDoNothing();
};

export const updateProduct = async (product: Stripe.Product) => {
  const price = await resolvePrice(product.default_price);
  await db
    .update(products)
    .set({
      name: product.name,
      description: product.description ?? null,
      priceId: price?.id ?? null,
      priceAmount: price?.unit_amount ?? 0,
      priceCurrency: price?.currency ?? "usd",
      recurringInterval: price?.recurring?.interval ?? null,
      isRecurring: !!price?.recurring,
      isArchived: !product.active,
      metadata: product.metadata ?? {},
      updatedAt: new Date(product.updated * 1000),
    })
    .where(eq(products.id, product.id));
};
// ----------------------------
// 📦 Products END
// ----------------------------

// ----------------------------
// 🔄 Subscriptions
// ----------------------------

function buildSubscriptionValues(sub: Stripe.Subscription, userId: string) {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const firstItem = sub.items.data[0];

  // Sum unit_amount × quantity across all subscription items
  const totalAmount = sub.items.data.reduce(
    (sum, item) => sum + (item.price.unit_amount ?? 0) * (item.quantity ?? 1),
    0
  );
  const currency = firstItem?.price?.currency ?? "usd";

  return {
    plan: firstItem?.price?.lookup_key ?? firstItem?.price?.id ?? "unknown",
    referenceId: userId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: sub.id,
    status: sub.status,
    periodStart: firstItem
      ? new Date(firstItem.current_period_start * 1000)
      : null,
    periodEnd: firstItem ? new Date(firstItem.current_period_end * 1000) : null,
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    cancelAt: sub.cancel_at ? new Date(sub.cancel_at * 1000) : null,
    canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
    endedAt: sub.ended_at ? new Date(sub.ended_at * 1000) : null,
    trialStart: sub.trial_start ? new Date(sub.trial_start * 1000) : null,
    trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
    seats: firstItem?.quantity ?? null,
    totalAmount,
    currency,
    itemCount: sub.items.data.length,
    billingInterval: firstItem?.price?.recurring?.interval ?? null,
  };
}

async function findUserByCustomerId(customerId: string) {
  return db
    .select()
    .from(user)
    .where(eq(user.stripeCustomerId, customerId))
    .limit(1)
    .then((res) => res[0]);
}

export const createSubscription = async (sub: Stripe.Subscription) => {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const dbUser = await findUserByCustomerId(customerId);
  if (!dbUser) return;

  await db
    .insert(subscription)
    .values({ id: sub.id, ...buildSubscriptionValues(sub, dbUser.id) })
    .onConflictDoNothing();
};

export const updateSubscription = async (sub: Stripe.Subscription) => {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const dbUser = await findUserByCustomerId(customerId);
  if (!dbUser) return;

  await db
    .update(subscription)
    .set(buildSubscriptionValues(sub, dbUser.id))
    .where(eq(subscription.stripeSubscriptionId, sub.id));
};

export const deleteSubscription = async (sub: Stripe.Subscription) => {
  await db
    .delete(subscription)
    .where(eq(subscription.stripeSubscriptionId, sub.id));
};
// ----------------------------
// 🔄 Subscriptions END
// ----------------------------

// ----------------------------
// 🛒 Orders (from Stripe invoices)
// ----------------------------
export const createInvoice = async (invoice: Stripe.Invoice) => {
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;

  // Look up user by stripeCustomerId
  const dbUser = customerId
    ? await db
        .select()
        .from(user)
        .where(eq(user.stripeCustomerId, customerId))
        .limit(1)
        .then((res) => res[0])
    : null;

  await db
    .insert(invoices)
    .values({
      id: invoice.id,
      userId: dbUser?.id ?? "",
      email: invoice.customer_email ?? dbUser?.email ?? "",
      productId:
        invoice.lines?.data?.[0]?.pricing?.price_details?.price?.toString() ??
        null,
      subscriptionId:
        invoice.parent?.subscription_details?.subscription?.toString() ?? null,
      billingName: invoice.customer_name ?? null,
      billingReason: invoice.billing_reason ?? null,
      totalAmount: invoice.amount_paid ?? 0,
      invoiceNumber: invoice.number ?? null,
      status: invoice.status ?? "draft",
      discountAmount: invoice.total_discount_amounts?.[0]?.amount ?? 0,
      currency: invoice.currency ?? "usd",
      hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
      pdfUrl: invoice.invoice_pdf ?? null,
      createdAt: new Date(invoice.created * 1000),
      updatedAt: new Date(),
      metadata: (invoice.metadata as Record<string, unknown>) ?? {},
    })
    .onConflictDoNothing();
};

export const updateInvoice = async (invoice: Stripe.Invoice) => {
  await db
    .update(invoices)
    .set({
      status: invoice.status ?? "draft",
      totalAmount: invoice.amount_paid ?? 0,
      invoiceNumber: invoice.number ?? null,
      billingName: invoice.customer_name ?? null,
      hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
      pdfUrl: invoice.invoice_pdf ?? null,
      updatedAt: new Date(),
    })
    .where(eq(invoices.id, invoice.id));
};

// ----------------------------
// 🛒 Orders END
// ----------------------------

// ----------------------------
// 💸 Refunds
// ----------------------------

type RefundStatus = typeof refunds.$inferInsert.status;

async function resolveInvoiceId(
  paymentIntentId: string | null | undefined
): Promise<string | null> {
  if (!paymentIntentId) return null;
  const result = await stripeClient.invoicePayments.list({
    payment: { payment_intent: paymentIntentId, type: "payment_intent" },
    limit: 1,
  });
  const invoicePayment = result.data[0];
  if (!invoicePayment) return null;
  return typeof invoicePayment.invoice === "string"
    ? invoicePayment.invoice
    : invoicePayment.invoice.id;
}

function extractStringId(
  field: string | { id: string } | null | undefined
): string | null {
  if (!field) return null;
  return typeof field === "string" ? field : field.id;
}

async function updateInvoiceRefundStatus(invoiceId: string | null) {
  if (!invoiceId) return;

  const invoice = await db
    .select()
    .from(invoices)
    .where(eq(invoices.id, invoiceId))
    .limit(1)
    .then((r) => r[0]);
  if (!invoice) return;

  const [result] = await db
    .select({
      total: sql<number>`COALESCE(SUM(${refunds.amount}), 0)`,
    })
    .from(refunds)
    .where(
      and(eq(refunds.invoiceId, invoiceId), eq(refunds.status, "succeeded"))
    );

  const succeededTotal = result?.total ?? 0;
  if (succeededTotal <= 0) return;

  const newStatus =
    succeededTotal >= invoice.totalAmount ? "void" : "uncollectible";

  await db
    .update(invoices)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(eq(invoices.id, invoiceId));
}

export const createRefund = async (refund: Stripe.Refund) => {
  const paymentIntentId = extractStringId(refund.payment_intent);
  const chargeId = extractStringId(refund.charge);
  const invoiceId = await resolveInvoiceId(paymentIntentId);

  await db
    .insert(refunds)
    .values({
      id: refund.id,
      invoiceId,
      chargeId,
      paymentIntentId,
      amount: refund.amount,
      currency: refund.currency,
      status: (refund.status ?? "pending") as RefundStatus,
      reason: refund.reason ?? null,
      failureReason: refund.failure_reason ?? null,
      createdAt: new Date(refund.created * 1000),
      updatedAt: new Date(),
      metadata: (refund.metadata as Record<string, unknown>) ?? {},
    })
    .onConflictDoNothing();

  await updateInvoiceRefundStatus(invoiceId);
};

export const updateRefund = async (refund: Stripe.Refund) => {
  const paymentIntentId = extractStringId(refund.payment_intent);
  const invoiceId = await resolveInvoiceId(paymentIntentId);

  await db
    .update(refunds)
    .set({
      status: (refund.status ?? "pending") as RefundStatus,
      reason: refund.reason ?? null,
      failureReason: refund.failure_reason ?? null,
      invoiceId,
      updatedAt: new Date(),
    })
    .where(eq(refunds.id, refund.id));

  await updateInvoiceRefundStatus(invoiceId);
};

export const handleChargeRefunded = async (charge: Stripe.Charge) => {
  const paymentIntentId = extractStringId(charge.payment_intent);
  const invoiceId = await resolveInvoiceId(paymentIntentId);
  const chargeId = charge.id;

  if (charge.refunds?.data) {
    for (const refund of charge.refunds.data) {
      await db
        .insert(refunds)
        .values({
          id: refund.id,
          invoiceId,
          chargeId,
          paymentIntentId,
          amount: refund.amount,
          currency: refund.currency,
          status: (refund.status ?? "pending") as RefundStatus,
          reason: refund.reason ?? null,
          failureReason: refund.failure_reason ?? null,
          createdAt: new Date(refund.created * 1000),
          updatedAt: new Date(),
          metadata: (refund.metadata as Record<string, unknown>) ?? {},
        })
        .onConflictDoNothing();
    }
  }

  await updateInvoiceRefundStatus(invoiceId);
};

export const revokeSubscriptionOnRefund = async (subscriptionId: string) => {
  if (!subscriptionId) throw new Error("Subscription ID is required");

  await stripeClient.subscriptions.cancel(subscriptionId);
};
// ----------------------------
// 💸 Refunds END
// ----------------------------

// ----------------------------
// 👤 Customers
// ----------------------------
export const deleteCustomer = async (email: string) => {
  if (!email) throw new Error("Customer email is required");

  const deletedUser = await db
    .delete(user)
    .where(eq(user.email, email))
    .returning()
    .then((res) => res[0]);
  if (!deletedUser) throw new Error("Failed to delete user");

  // Deleting all images from the user
  if (deletedUser.image) {
    await deleteFile(deletedUser.image);
  }

  return deletedUser;
};
// ----------------------------
// 👤 Customers END
// ----------------------------
