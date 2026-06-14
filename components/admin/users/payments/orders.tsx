import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Braces } from "lucide-react";

import { useTRPC } from "@/services/trpc/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/data-table";
import { FormattedJSON } from "@/components/json-format";

export const Orders = () => {
  const { id } = useParams<{ id: string }>();

  const trpc = useTRPC();
  const { data: user } = useQuery(
    trpc.users.get.queryOptions(id, {
      enabled: !!id,
    })
  );

  const {
    data: ordersList,
    isPending,
    isError,
  } = useQuery(
    trpc.payments.listOrders.queryOptions(
      {
        userId: user?.id || "",
      },
      {
        enabled: !!user?.id,
        refetchOnWindowFocus: true,
      }
    )
  );

  const totalRevenue =
    ordersList
      ?.filter((o) => o.status === "paid")
      .reduce((acc, o) => acc + o.totalAmount - o.discountAmount, 0) || 0;

  if (isError) {
    return (
      <p className="text-destructive py-4 text-sm">Failed to load orders.</p>
    );
  }

  return (
    <div>
      <DataTable
        isLoading={isPending}
        columns={[
          {
            id: "id",
            header: "ID",
            cell: ({ row }) => (
              <Badge className="font-mono text-xs">
                {row.original.id.slice(0, 16)}…
              </Badge>
            ),
          },
          {
            id: "product",
            header: "Product",
            cell: ({ row }) => <span>{row.original.productName || "—"}</span>,
          },
          {
            id: "status",
            header: "Status",
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
            id: "amount",
            header: "Amount",
            cell: ({ row }) => (
              <span>${(row.original.totalAmount / 100).toFixed(2)}</span>
            ),
          },
          {
            id: "orderNumber",
            header: "Order #",
            cell: ({ row }) => (
              <span className="text-muted-foreground font-mono text-xs">
                {row.original.invoiceNumber || "—"}
              </span>
            ),
          },
          {
            id: "created_at",
            header: "Date",
            cell: ({ row }) => (
              <span>
                {format(
                  row.original.createdAt ?? new Date(),
                  "MM/dd/yyyy hh:mm a"
                )}
              </span>
            ),
          },
          {
            id: "json-data",
            cell: ({ row }) => (
              <Dialog>
                <DialogTrigger
                  render={
                    <Button variant="outline" size="icon">
                      <Braces />
                    </Button>
                  }
                />
                <DialogContent className="sm:max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                  </DialogHeader>
                  <FormattedJSON data={row.original} />
                </DialogContent>
              </Dialog>
            ),
          },
        ]}
        data={ordersList || []}
      />
      <div className="bg-muted text-muted-foreground -mt-3 rounded-b-xl p-4 pt-7 text-xs">
        <div className="mt-4 text-center">
          <p className="text-foreground text-lg font-medium">Net Revenue</p>
          <p className="text-xl">${(totalRevenue / 100).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
