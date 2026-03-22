"use client";

import Link from "next/link";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Ban,
  CircleDollarSign,
  RefreshCcw,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table";

const formatCurrency = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);

export const AdminOverview = () => {
  const trpc = useTRPC();
  const { data, isPending } = useQuery(
    trpc.admin.overview.getStats.queryOptions()
  );

  if (isPending) return <OverviewSkeleton />;
  if (!data) return null;

  const { users, subscriptions, revenue, recentOrders } = data;

  return (
    <div className="space-y-10">
      {/* Primary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Recurring Revenue"
          value={formatCurrency(revenue.mrr)}
          icon={CircleDollarSign}
          sub="Active subscriptions"
        />
        <StatCard
          title="Revenue This Month"
          value={formatCurrency(revenue.thisMonth)}
          icon={TrendingUp}
          sub="Paid orders"
        />
        <StatCard
          title="Active Subscriptions"
          value={subscriptions.active.toLocaleString()}
          icon={RefreshCcw}
          sub={
            subscriptions.trialing > 0
              ? `+${subscriptions.trialing} trialing`
              : undefined
          }
        />
        <StatCard
          title="Total Users"
          value={users.total.toLocaleString()}
          icon={Users}
          sub={`+${users.newThisMonth} this month`}
        />
      </div>

      <Separator />

      {/* Secondary metrics */}
      <div>
        <SectionLabel>Breakdown</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(revenue.total)}
            icon={CircleDollarSign}
            sub="All time"
          />
          <StatCard
            title="Canceled This Month"
            value={subscriptions.canceledThisMonth.toLocaleString()}
            icon={TrendingDown}
            sub="Subscriptions"
          />
          <StatCard
            title="Banned Users"
            value={users.banned.toLocaleString()}
            icon={Ban}
            sub="Active bans"
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <SectionLabel className="mb-0">Recent Orders</SectionLabel>
          <Link
            href="/admin/products"
            className="text-muted-foreground hover:text-foreground text-xs transition-colors"
          >
            View all →
          </Link>
        </div>
        <DataTable columns={recentOrdersColumns} data={recentOrders} />
      </div>
    </div>
  );
};

// ─── Local sub-components ──────────────────────────────────────────────────────

type RecentOrder = {
  id: string;
  email: string;
  billingName: string;
  totalAmount: number;
  status: string;
  createdAt: string | null;
};

const recentOrdersColumns: ColumnDef<RecentOrder>[] = [
  {
    accessorKey: "billingName",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
          {row.original.billingName?.charAt(0)?.toUpperCase() ?? "?"}
        </div>
        <div>
          <p className="text-sm leading-none font-medium">
            {row.original.billingName}
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {row.original.email}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(row.original.totalAmount)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "paid" ? "default" : "secondary"}
        className="capitalize"
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      row.original.createdAt
        ? format(new Date(row.original.createdAt), "MMM d, yyyy")
        : "—",
  },
];

const StatCard = ({
  title,
  value,
  icon: Icon,
  sub,
  muted = false,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
  muted?: boolean;
}) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-3">
        <CardTitle className="text-muted-foreground text-sm leading-snug font-medium">
          {title}
        </CardTitle>
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${muted ? "bg-muted" : "bg-primary/10"}`}
        >
          <Icon
            className={`h-4 w-4 ${muted ? "text-muted-foreground" : "text-primary"}`}
          />
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <p
        className={`text-3xl font-bold tracking-tight ${muted ? "text-muted-foreground" : ""}`}
      >
        {value}
      </p>
      {sub && (
        <p className="text-muted-foreground mt-1.5 text-xs font-medium">
          {sub}
        </p>
      )}
    </CardContent>
  </Card>
);

const SectionLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p
    className={`text-muted-foreground mb-4 text-xs font-semibold tracking-widest uppercase ${className ?? ""}`}
  >
    {children}
  </p>
);

const OverviewSkeleton = () => (
  <div className="space-y-10">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="size-9 rounded-xl" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="mt-1.5 h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Separator />
    <div className="space-y-4">
      <Skeleton className="h-3 w-20" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="size-9 rounded-xl" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-1.5 h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    <div className="space-y-4">
      <Skeleton className="h-3 w-24" />
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <div>
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="mt-1 h-3 w-36" />
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
