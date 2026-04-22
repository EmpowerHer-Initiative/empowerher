import { stripeClient } from "@/services/auth/auth";
import { db } from "@/services/db/index";
import { invoices, products, user } from "@/services/db/schema";
import { eq } from "drizzle-orm";
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

export const revokeSubscriptionOnRefund = async (subscriptionId: string) => {
  if (!subscriptionId) throw new Error("Subscription ID is required");

  await stripeClient.subscriptions.cancel(subscriptionId);
};
// ----------------------------
// 🛒 Orders END
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
