import { cookies } from "next/headers";
import { stripeClient } from "@/services/auth/auth";
import { deleteCustomer } from "@/services/auth/auth-action";
import { db } from "@/services/db/index";
import { invoices, subscription, user } from "@/services/db/schema";
import { authenticatedProcedure, createTRPCRouter } from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import { TRPCError } from "@trpc/server";
import { desc, eq, or } from "drizzle-orm";
import { z } from "zod";

export const billingRouter = createTRPCRouter({
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
   * Fetches subscriptions for a specific user by user ID
   */
  listSubscriptions: authenticatedProcedure
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
   * Fetches invoices for a specific user by user ID or email
   */
  listInvoices: authenticatedProcedure
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
});
