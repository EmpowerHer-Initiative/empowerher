"use client";

import { useCurrentUser } from "@/services/auth/hooks/use-user";
import { useTRPC } from "@/services/trpc/client";
import { RouterOutputs } from "@/services/trpc/routers/_app";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";

type Order = RouterOutputs["billing"]["listOrders"][number];

const columns: ColumnDef<Order>[] = [
  {
    header: "Product",
    accessorKey: "productName",
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.productName || "—"}
      </span>
    ),
  },
  {
    header: "Amount",
    accessorKey: "totalAmount",
    cell: ({ row }) => {
      const amount = row.original.totalAmount / 100;
      return <span>${amount.toFixed(2)}</span>;
    },
  },
  {
    header: "Date",
    accessorKey: "createdAt",
    cell: ({ row }) =>
      row.original.createdAt
        ? format(row.original.createdAt, "MMM d, yyyy")
        : "—",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const { status } = row.original;
      const variant =
        status === "paid"
          ? "default"
          : status === "refunded"
            ? "secondary"
            : "outline";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    header: "Invoice",
    accessorKey: "invoiceNumber",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {row.original.invoiceNumber || "—"}
      </span>
    ),
  },
];

export const BillingInvoices = () => {
  const { data: user } = useCurrentUser();

  const trpc = useTRPC();
  const { data: ordersList, isLoading } = useQuery(
    trpc.billing.listOrders.queryOptions(
      {
        userId: user?.user.id || "",
      },
      {
        enabled: !!user?.user.id,
        refetchOnWindowFocus: true,
      }
    )
  );

  return (
    <div className="space-y-4">
      <h3 className="text-muted-foreground relative z-10 mt-4 text-sm">
        Payment History
      </h3>
      <DataTable
        columns={columns}
        data={ordersList ?? []}
        isLoading={isLoading}
      />
    </div>
  );
};
