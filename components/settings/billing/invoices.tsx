"use client";

import { useMemo } from "react";
import { useCurrentUser } from "@/services/auth/hooks/use-user";
import { useTRPC } from "@/services/trpc/client";
import { RouterOutputs } from "@/services/trpc/routers/_app";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";

type Invoice = RouterOutputs["billing"]["listInvoices"][number];

const columns: ColumnDef<Invoice>[] = [
  {
    header: "Invoice",
    accessorKey: "invoiceNumber",
    cell: ({ row }) => (
      <span className="font-mono text-sm">
        {row.original.invoiceNumber || "Pending"}
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

      if (status === "void") {
        return <Badge variant="secondary">refunded</Badge>;
      }
      if (status === "uncollectible") {
        return <Badge variant="outline">partial refund</Badge>;
      }

      return (
        <Badge variant={status === "paid" ? "default" : "destructive"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const invoice = row.original;
      if (!invoice.hostedInvoiceUrl) return null;
      return (
        <div className="flex justify-end">
          <a
            href={invoice.hostedInvoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon" className="size-8">
              <ExternalLink className="size-4" />
            </Button>
          </a>
        </div>
      );
    },
  },
];

export const BillingInvoices = () => {
  const { data: user } = useCurrentUser();

  const trpc = useTRPC();
  const { data: orders, isLoading } = useQuery(
    trpc.billing.listInvoices.queryOptions(
      {
        userId: user?.user.id || "",
        email: user?.user.email || "",
      },
      {
        enabled: !!user?.user.id || !!user?.user.email,
        refetchOnWindowFocus: true,
      }
    )
  );

  const invoices = useMemo(
    () => orders?.filter((order) => order.userId === user?.user.id) || [],
    [orders, user?.user]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-muted-foreground relative z-10 mt-4 text-sm">
        Invoices
      </h3>
      <DataTable columns={columns} data={invoices} isLoading={isLoading} />
    </div>
  );
};
