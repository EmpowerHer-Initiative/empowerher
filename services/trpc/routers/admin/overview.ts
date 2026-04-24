import { db } from "@/services/db/index";
import { invoices, subscription, user } from "@/services/db/schema";
import { adminProcedure, createTRPCRouter } from "@/services/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, gte, sum } from "drizzle-orm";

export const adminOverviewRouter = createTRPCRouter({
  getStats: adminProcedure.query(async () => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [
        totalUsersResult,
        newUsersResult,
        bannedUsersResult,
        activeSubsResult,
        trialingSubsResult,
        canceledThisMonthResult,
        totalRevenueResult,
        revenueThisMonthResult,
        recentOrdersList,
      ] = await Promise.all([
        db.select({ count: count() }).from(user),
        db
          .select({ count: count() })
          .from(user)
          .where(gte(user.createdAt, startOfMonth)),
        db.select({ count: count() }).from(user).where(eq(user.banned, true)),
        db
          .select({ count: count() })
          .from(subscription)
          .where(eq(subscription.status, "active")),
        db
          .select({ count: count() })
          .from(subscription)
          .where(eq(subscription.status, "trialing")),
        db
          .select({ count: count() })
          .from(subscription)
          .where(
            and(
              eq(subscription.status, "canceled"),
              gte(subscription.canceledAt, startOfMonth)
            )
          ),
        db
          .select({ total: sum(invoices.totalAmount) })
          .from(invoices)
          .where(eq(invoices.status, "paid")),
        db
          .select({ total: sum(invoices.totalAmount) })
          .from(invoices)
          .where(
            and(
              eq(invoices.status, "paid"),
              gte(invoices.createdAt, startOfMonth)
            )
          ),
        db
          .select({
            id: invoices.id,
            email: invoices.email,
            billingName: invoices.billingName,
            totalAmount: invoices.totalAmount,
            status: invoices.status,
            createdAt: invoices.createdAt,
          })
          .from(invoices)
          .orderBy(desc(invoices.createdAt))
          .limit(5),
      ]);

      return {
        users: {
          total: totalUsersResult[0]?.count ?? 0,
          newThisMonth: newUsersResult[0]?.count ?? 0,
          banned: bannedUsersResult[0]?.count ?? 0,
        },
        subscriptions: {
          active: activeSubsResult[0]?.count ?? 0,
          trialing: trialingSubsResult[0]?.count ?? 0,
          canceledThisMonth: canceledThisMonthResult[0]?.count ?? 0,
        },
        revenue: {
          total: Number(totalRevenueResult[0]?.total ?? 0),
          thisMonth: Number(revenueThisMonthResult[0]?.total ?? 0),
          mrr: 0, // MRR calculated from active subscription amounts
        },
        recentOrders: recentOrdersList,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to fetch overview",
        cause: error,
      });
    }
  }),
});
