import { db } from "@/services/db/index";
import { orders, subscriptions, user } from "@/services/db/schema";
import { adminProcedure, createTRPCRouter } from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, gte, sum } from "drizzle-orm";

export const adminOverviewRouter = createTRPCRouter({
  getStats: adminProcedure.use(featureGuard("admin")).query(async () => {
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
        mrrResult,
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
          .from(subscriptions)
          .where(eq(subscriptions.status, "active")),
        db
          .select({ count: count() })
          .from(subscriptions)
          .where(eq(subscriptions.status, "trialing")),
        db
          .select({ count: count() })
          .from(subscriptions)
          .where(
            and(
              eq(subscriptions.status, "canceled"),
              gte(subscriptions.canceledAt, startOfMonth)
            )
          ),
        db
          .select({ total: sum(orders.totalAmount) })
          .from(orders)
          .where(eq(orders.status, "paid")),
        db
          .select({ total: sum(orders.totalAmount) })
          .from(orders)
          .where(
            and(eq(orders.status, "paid"), gte(orders.createdAt, startOfMonth))
          ),
        db
          .select({ total: sum(subscriptions.amount) })
          .from(subscriptions)
          .where(eq(subscriptions.status, "active")),
        db
          .select({
            id: orders.id,
            email: orders.email,
            billingName: orders.billingName,
            totalAmount: orders.totalAmount,
            status: orders.status,
            createdAt: orders.createdAt,
          })
          .from(orders)
          .orderBy(desc(orders.createdAt))
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
          mrr: Number(mrrResult[0]?.total ?? 0),
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
