import { removeCustomer } from "@/services/auth/actions";
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
import { TRPCError } from "@trpc/server";
import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const billingRouter = createTRPCRouter({
  getCustomerState: authenticatedProcedure
    .use(featureGuard("payments"))
    .query(async ({ ctx }) => {
      const [subs, paidOrders] = await Promise.all([
        db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, ctx.session.user.id)),
        db
          .select()
          .from(orders)
          .where(eq(orders.userId, ctx.session.user.id))
          .then((rows) => rows.filter((o) => o.status === "paid")),
      ]);

      const activeSub = subs.find(
        (s) => s.status === "active" || s.status === "trialing"
      );

      return {
        subscriptions: subs,
        activeSubscription: activeSub ?? null,
        paidOrders,
        isUserHaveAccess: !!activeSub || paidOrders.length > 0,
        currentProductId: activeSub?.productId ?? null,
        currentSubscriptionId: activeSub?.id ?? null,
      };
    }),

  listSubscriptions: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
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

  listOrders: authenticatedProcedure
    .use(featureGuard("payments"))
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
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

  getProducts: baseProcedure.use(featureGuard("payments")).query(async () => {
    return db.select().from(products).orderBy(asc(products.priceAmount));
  }),

  listProducts: baseProcedure.use(featureGuard("payments")).query(async () => {
    return db
      .select()
      .from(products)
      .where(eq(products.isArchived, false))
      .orderBy(asc(products.priceAmount));
  }),

  updateProduct: adminProcedure
    .use(featureGuard("payments"))
    .input(
      z.object({
        id: z.string(),
        product: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
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

      if (dbUser?.email) {
        await deleteCustomerByEmail(dbUser.email);
      }

      await removeCustomer(dbUser?.email ?? "");

      return true;
    }),
});
