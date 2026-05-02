import { db } from "@/services/db/index";
import { products, subscription } from "@/services/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

import { findUserByCustomerId } from "./helpers";

async function buildSubscriptionValues(
  sub: Stripe.Subscription,
  userId: string
) {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const firstItem = sub.items.data[0];

  const totalAmount = sub.items.data.reduce(
    (sum, item) => sum + (item.price.unit_amount ?? 0) * (item.quantity ?? 1),
    0
  );
  const currency = firstItem?.price?.currency ?? "usd";

  // Look up product metadata to merge with subscription metadata
  const productRef = firstItem?.price?.product;
  const productId =
    typeof productRef === "string"
      ? productRef
      : productRef && "id" in productRef
        ? productRef.id
        : null;

  const product = productId
    ? await db
        .select({ metadata: products.metadata })
        .from(products)
        .where(eq(products.id, productId))
        .limit(1)
        .then((r) => r[0])
    : null;

  const productMeta =
    product?.metadata && typeof product.metadata === "object"
      ? (product.metadata as Record<string, unknown>)
      : {};

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
    metadata: { ...sub.metadata, ...productMeta },
  };
}

export const createSubscription = async (sub: Stripe.Subscription) => {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const dbUser = await findUserByCustomerId(customerId);
  if (!dbUser) return;

  await db
    .insert(subscription)
    .values({ id: sub.id, ...(await buildSubscriptionValues(sub, dbUser.id)) })
    .onConflictDoNothing();
};

export const updateSubscription = async (sub: Stripe.Subscription) => {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const dbUser = await findUserByCustomerId(customerId);
  if (!dbUser) return;

  await db
    .update(subscription)
    .set(await buildSubscriptionValues(sub, dbUser.id))
    .where(eq(subscription.stripeSubscriptionId, sub.id));
};

export const deleteSubscription = async (sub: Stripe.Subscription) => {
  await db
    .delete(subscription)
    .where(eq(subscription.stripeSubscriptionId, sub.id));
};
