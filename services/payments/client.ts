// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getStripeClient } from "@/services/auth/auth";
import { notSupported } from "@/services/not-supported";

import type {
  CreateCheckoutInput,
  CreateCheckoutOutput,
  CreateCustomerInput,
  CreateCustomerOutput,
  CreatePortalSessionInput,
  CreatePortalSessionOutput,
  PromotionCode,
  RetrieveCheckoutOutput,
  SubscriptionDetails,
  SwitchPlanInput,
  SwitchPlanOutput,
} from "./types";

export async function createCustomer(
  input: CreateCustomerInput
): Promise<CreateCustomerOutput> {
  const stripe = getStripeClient();
  const customer = await stripe.customers.create({
    email: input.email,
    name: input.name,
    metadata: input.metadata,
  });
  return { customerId: customer.id };
}

export async function deleteCustomer(customerId: string): Promise<void> {
  const stripe = getStripeClient();
  await stripe.customers.del(customerId);
}

export async function createCheckoutSession(
  input: CreateCheckoutInput
): Promise<CreateCheckoutOutput> {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.create({
    customer: input.customerId,
    mode: input.mode,
    line_items: input.priceIds.map((id) => ({ price: id, quantity: 1 })),
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: input.metadata,
    ...(input.mode === "payment" && {
      payment_intent_data: {
        metadata: {
          type: "one_time_purchase",
          price_ids: input.priceIds.join(","),
        },
      },
    }),
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session URL");
  }

  return { url: session.url };
}

export async function retrieveCheckoutSession(
  sessionId: string
): Promise<RetrieveCheckoutOutput> {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return {
    status: session.status,
    paymentStatus: session.payment_status,
    customerEmail: session.customer_details?.email ?? null,
  };
}

export async function createPortalSession(
  input: CreatePortalSessionInput
): Promise<CreatePortalSessionOutput> {
  const stripe = getStripeClient();
  const session = await stripe.billingPortal.sessions.create({
    customer: input.customerId,
    return_url: input.returnUrl,
  });
  return { url: session.url };
}

export async function getSubscriptionDetails(
  subscriptionId: string
): Promise<SubscriptionDetails> {
  const stripe = getStripeClient();
  const stripeSub = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["items.data.price.product"],
  });

  return {
    id: stripeSub.id,
    status: stripeSub.status,
    cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
    cancelAt: stripeSub.cancel_at,
    canceledAt: stripeSub.canceled_at,
    currentPeriodStart: stripeSub.items.data[0]?.current_period_start ?? null,
    currentPeriodEnd: stripeSub.items.data[0]?.current_period_end ?? null,
    items: stripeSub.items.data.map((item) => {
      const product =
        typeof item.price.product === "object" && "name" in item.price.product
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
}

export async function switchPlan(
  input: SwitchPlanInput
): Promise<SwitchPlanOutput> {
  const stripe = getStripeClient();
  const stripeSub = await stripe.subscriptions.retrieve(input.subscriptionId);
  const itemId = stripeSub.items.data[0]?.id;

  if (!itemId) {
    throw new Error("No subscription item found");
  }

  if (input.immediate !== false) {
    // Upgrade: apply immediately with proration
    const updated = await stripe.subscriptions.update(input.subscriptionId, {
      items: [{ id: itemId, price: input.newPriceId }],
      proration_behavior: "create_prorations",
    });
    return { subscriptionId: updated.id, status: updated.status };
  }

  // Downgrade: schedule the new price at the end of the current period
  const schedules = await stripe.subscriptionSchedules.list({
    customer:
      typeof stripeSub.customer === "string"
        ? stripeSub.customer
        : stripeSub.customer.id,
  });
  const existing = schedules.data.find(
    (s) =>
      s.subscription ===
        (typeof stripeSub.id === "string" ? stripeSub.id : null) &&
      (s.status === "active" || s.status === "not_started")
  );

  if (existing) {
    // Update existing schedule's upcoming phase
    const lastPhase = existing.phases[existing.phases.length - 1];
    await stripe.subscriptionSchedules.update(existing.id, {
      phases: [
        ...existing.phases.slice(0, -1).map((p) => ({
          items: p.items.map((i) => ({
            price: typeof i.price === "string" ? i.price : i.price.id,
            quantity: i.quantity ?? 1,
          })),
          start_date: p.start_date,
          end_date: p.end_date ?? undefined,
        })),
        {
          items: [{ price: input.newPriceId, quantity: 1 }],
          start_date: lastPhase.end_date ?? undefined,
        },
      ],
    });
  } else {
    // Create a new schedule from the existing subscription
    const schedule = await stripe.subscriptionSchedules.create({
      from_subscription: input.subscriptionId,
    });

    const currentPhase = schedule.phases[0];
    await stripe.subscriptionSchedules.update(schedule.id, {
      phases: [
        {
          items: currentPhase.items.map((i) => ({
            price: typeof i.price === "string" ? i.price : i.price.id,
            quantity: i.quantity ?? 1,
          })),
          start_date: currentPhase.start_date,
          end_date: currentPhase.end_date ?? undefined,
        },
        {
          items: [{ price: input.newPriceId, quantity: 1 }],
          start_date: currentPhase.end_date ?? undefined,
        },
      ],
    });
  }

  return { subscriptionId: stripeSub.id, status: stripeSub.status };
}

export async function listPromotionCodes(options?: {
  code?: string;
  active?: boolean;
  limit?: number;
}): Promise<PromotionCode[]> {
  const stripe = getStripeClient();
  const result = await stripe.promotionCodes.list({
    ...options,
    expand: ["data.coupon"],
  });

  return result.data.map((pc) => {
    const coupon =
      typeof pc.promotion.coupon === "object" && pc.promotion.coupon
        ? pc.promotion.coupon
        : null;

    return {
      id: pc.id,
      code: pc.code,
      active: pc.active,
      expiresAt: pc.expires_at,
      timesRedeemed: pc.times_redeemed,
      maxRedemptions: pc.max_redemptions,
      coupon: {
        id: coupon?.id ?? "",
        percentOff: coupon?.percent_off ?? null,
        amountOff: coupon?.amount_off ?? null,
        currency: coupon?.currency ?? null,
      },
    };
  });
}
