"use client";

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
import { DataTable } from "@/components/data-table";

const formatCurrency = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);

export const AdminOverview = () => {
  const trpc = useTRPC();
  const { data, isPending } = useQuery(
    trpc.admin.overview.getStats.queryOptions()
  );

  if (isPending) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <Card key={j} className="h-28 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const { users, subscriptions, revenue, recentOrders } = data;

  return (
    <div className="space-y-8">
      <section>
        <SectionHeading>Users</SectionHeading>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Total Users"
            value={users.total.toLocaleString()}
            icon={Users}
          />
          <StatCard
            title="New This Month"
            value={users.newThisMonth.toLocaleString()}
            icon={TrendingUp}
          />
          <StatCard
            title="Banned"
            value={users.banned.toLocaleString()}
            icon={Ban}
          />
        </div>
      </section>

      <section>
        <SectionHeading>Subscriptions</SectionHeading>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Active"
            value={subscriptions.active.toLocaleString()}
            icon={TrendingUp}
          />
          <StatCard
            title="Trialing"
            value={subscriptions.trialing.toLocaleString()}
            icon={RefreshCcw}
          />
          <StatCard
            title="Canceled This Month"
            value={subscriptions.canceledThisMonth.toLocaleString()}
            icon={TrendingDown}
          />
        </div>
      </section>

      <section>
        <SectionHeading>Revenue</SectionHeading>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(revenue.total)}
            icon={CircleDollarSign}
          />
          <StatCard
            title="Revenue This Month"
            value={formatCurrency(revenue.thisMonth)}
            icon={CircleDollarSign}
          />
          <StatCard
            title="MRR"
            value={formatCurrency(revenue.mrr)}
            icon={CircleDollarSign}
            sub="Based on active subscriptions"
          />
        </div>
      </section>

      <section>
        <SectionHeading>Recent Orders</SectionHeading>
        <DataTable
          columns={recentOrdersColumns}
          data={recentOrders}
          isLoading={isPending}
        />
      </section>
    </div>
  );
};

// — Local sub-components —

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
      <div>
        <p className="font-medium">{row.original.billingName}</p>
        <p className="text-muted-foreground text-xs">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => formatCurrency(row.original.totalAmount),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "paid" ? "default" : "secondary"}>
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
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-muted-foreground text-sm font-medium">
        {title}
      </CardTitle>
      <Icon className="text-muted-foreground h-4 w-4" />
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-muted-foreground mt-1 text-xs">{sub}</p>}
    </CardContent>
  </Card>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-muted-foreground mb-4 text-xs font-semibold tracking-widest uppercase">
    {children}
  </h2>
);
