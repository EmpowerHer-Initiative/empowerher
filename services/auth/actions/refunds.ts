import { db } from "@/services/db/index";
import { orders } from "@/services/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

export const processRefund = async (charge: Stripe.Charge) => {
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;
  if (!paymentIntentId)
    throw new Error("charge.refunded: missing payment_intent");

  const order = await db
    .select({ id: orders.id, amount: orders.amount })
    .from(orders)
    .where(eq(orders.id, paymentIntentId))
    .limit(1)
    .then((r) => r[0]);
  if (!order)
    throw new Error(
      `charge.refunded: no order for payment_intent ${paymentIntentId}`
    );

  const isFullRefund = charge.amount_refunded >= order.amount;
  await db
    .update(orders)
    .set({
      status: isFullRefund ? "refunded" : "partially_refunded",
      refundedAmount: charge.amount_refunded,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, paymentIntentId));
};
