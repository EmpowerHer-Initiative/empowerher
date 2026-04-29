import { getStripeClient } from "@/services/auth/auth";
import { db } from "@/services/db/index";
import { orders } from "@/services/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

import { findUserByCustomerId } from "./helpers";

export const completeCheckout = async (session: Stripe.Checkout.Session) => {
  if (session.mode !== "payment") return;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  if (!paymentIntentId)
    throw new Error("checkout.session.completed: missing payment_intent");

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;
  if (!customerId)
    throw new Error("checkout.session.completed: missing customer");

  const dbUser = await findUserByCustomerId(customerId);
  if (!dbUser)
    throw new Error(
      `checkout.session.completed: no user for customer ${customerId}`
    );

  const stripeClient = getStripeClient();
  const lineItems = await stripeClient.checkout.sessions.listLineItems(
    session.id
  );
  const firstItem = lineItems.data[0];

  const priceId = firstItem?.price?.id ?? null;
  const productRef = firstItem?.price?.product;
  const productId =
    typeof productRef === "string"
      ? productRef
      : productRef && "id" in productRef
        ? productRef.id
        : null;

  const status = session.payment_status === "paid" ? "paid" : "pending";

  // Fetch receipt URL from the latest charge
  const pi = await stripeClient.paymentIntents.retrieve(paymentIntentId, {
    expand: ["latest_charge"],
  });
  const receiptUrl = (pi.latest_charge as Stripe.Charge)?.receipt_url ?? null;

  await db
    .insert(orders)
    .values({
      id: paymentIntentId,
      userId: dbUser.id,
      stripeCustomerId: customerId,
      productId,
      priceId,
      amount: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      status,
      receiptUrl,
      stripeSessionId: session.id,
      metadata: session.metadata ?? {},
    })
    .onConflictDoNothing();
};

export const confirmAsyncPayment = async (session: Stripe.Checkout.Session) => {
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  if (!paymentIntentId)
    throw new Error("async_payment_succeeded: missing payment_intent");

  await db
    .update(orders)
    .set({ status: "paid", updatedAt: new Date() })
    .where(eq(orders.id, paymentIntentId));
};

export const failAsyncPayment = async (session: Stripe.Checkout.Session) => {
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  if (!paymentIntentId)
    throw new Error("async_payment_failed: missing payment_intent");

  await db
    .update(orders)
    .set({ status: "void", updatedAt: new Date() })
    .where(eq(orders.id, paymentIntentId));
};
