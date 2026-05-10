"use client";

import { useCurrentUser } from "@/services/auth/hooks/use-user";
import { useTRPC } from "@/services/trpc/client";
import { RouterOutputs } from "@/services/trpc/routers/_app";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";

type Order = RouterOutputs["payments"]["listOrders"][number];

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
    header: "Order #",
    accessorKey: "invoiceNumber",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-xs">
        {row.original.invoiceNumber || "—"}
      </span>
    ),
  },
];

export const BillingOrders = () => {
  const { data: user } = useCurrentUser();

  const trpc = useTRPC();
  const {
    data: ordersList,
    isLoading,
    isError,
    error,
  } = useQuery(
    trpc.payments.listOrders.queryOptions(
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
        Order History
      </h3>
      {isError ? (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load orders.{" "}
            {error?.message && (
              <span className="text-muted-foreground text-xs">
                {error.message}
              </span>
            )}
          </AlertDescription>
        </Alert>
      ) : (
        <DataTable
          columns={columns}
          data={ordersList ?? []}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
