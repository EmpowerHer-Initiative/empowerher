"use client";

import { useMemo, useState } from "react";
import {
  useCancelSubscription,
  useGeneratePortalLink,
  useSubscriptionDetails,
} from "@/services/auth/hooks/use-payments";
import { useCurrentUser } from "@/services/auth/hooks/use-user";
import { useTRPC } from "@/services/trpc/client";
import { RouterOutputs } from "@/services/trpc/routers/_app";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronRight, CreditCard, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";

type Subscription = RouterOutputs["billing"]["listSubscriptions"][number];

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500",
  trialing: "bg-blue-500",
  past_due: "bg-amber-500",
  canceled: "bg-red-500",
  unpaid: "bg-orange-500",
  incomplete: "bg-yellow-500",
  incomplete_expired: "bg-gray-400",
  paused: "bg-violet-500",
};

function StatusDot({
  status,
  isCanceling,
}: {
  status: string;
  isCanceling?: boolean;
}) {
  const color =
    isCanceling && status === "active"
      ? "bg-amber-500"
      : (STATUS_COLORS[status] ?? "bg-gray-400");

  return (
    <span
      className={cn("inline-block size-2.5 shrink-0 rounded-full", color)}
    />
  );
}

function SubscriptionDetailsPanel({ sub }: { sub: Subscription }) {
  const { data, isLoading } = useSubscriptionDetails(sub.id);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
        <div>
          <p className="text-muted-foreground text-xs">Status</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <StatusDot
              status={sub.status}
              isCanceling={!!sub.cancelAtPeriodEnd}
            />
            <span className="capitalize">
              {sub.cancelAtPeriodEnd ? "canceling" : sub.status}
            </span>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Auto-Renewal</p>
          <Badge
            variant={sub.cancelAtPeriodEnd ? "destructive" : "default"}
            className="mt-0.5"
          >
            {sub.cancelAtPeriodEnd ? "Off" : "On"}
          </Badge>
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">Subscription ID</p>
          <span className="text-muted-foreground block truncate font-mono text-xs">
            {sub.id}
          </span>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Interval</p>
          <span className="capitalize">{sub.recurringInterval ?? "—"}</span>
        </div>
        {sub.canceledAt && (
          <div>
            <p className="text-muted-foreground text-xs">Canceled At</p>
            <span>{format(new Date(sub.canceledAt), "MMM d, yyyy")}</span>
          </div>
        )}
        {sub.trialEnd && (
          <div>
            <p className="text-muted-foreground text-xs">Trial Ends</p>
            <span>{format(new Date(sub.trialEnd), "MMM d, yyyy")}</span>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="text-muted-foreground flex items-center gap-2 py-2 text-sm">
          <Loader2 className="size-4 animate-spin" />
          Loading details...
        </div>
      )}

      {data && (
        <div className="rounded-md border p-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-muted-foreground text-xs">Amount</span>
              <p>
                ${((data.amount ?? 0) / 100).toFixed(2)}{" "}
                {data.currency?.toUpperCase()}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Started</span>
              <p>
                {data.startedAt
                  ? format(new Date(data.startedAt), "MMM d, yyyy")
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const BillingSubscriptions = () => {
  const { data: user } = useCurrentUser();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const generatePortalLink = useGeneratePortalLink();

  const trpc = useTRPC();
  const { data: subscriptionsList, isPending } = useQuery(
    trpc.billing.listSubscriptions.queryOptions(
      {
        userId: user?.user.id || "",
      },
      {
        enabled: !!user?.user.id,
      }
    )
  );

  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  const columns = useMemo<ColumnDef<Subscription>[]>(
    () => [
      {
        id: "plan",
        header: "Plan",
        cell: ({ row }) => {
          const isCanceling = !!row.original.cancelAtPeriodEnd;
          return (
            <div className="flex items-center gap-2.5">
              <StatusDot
                status={row.original.status}
                isCanceling={isCanceling}
              />
              <span className="max-w-[140px] truncate font-medium">
                {row.original.productName ?? row.original.productId}
              </span>
            </div>
          );
        },
      },
      {
        id: "price",
        header: "Price",
        cell: ({ row }) => {
          if (!row.original.amount)
            return <span className="text-muted-foreground">—</span>;
          return (
            <span className="text-sm">
              ${(row.original.amount / 100).toFixed(2)}
              <span className="text-muted-foreground ml-1 text-xs uppercase">
                {row.original.currency}
              </span>
            </span>
          );
        },
      },
      {
        id: "interval",
        header: "Interval",
        cell: ({ row }) => (
          <span className="capitalize">
            {row.original.recurringInterval ?? "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const isExpanded = expandedRows.has(row.id);
          return (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRow(row.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
                More Info
              </Button>
            </div>
          );
        },
      },
    ],
    [expandedRows]
  );

  return (
    <div className="space-y-4">
      <div className="mt-4 flex items-center justify-between gap-2">
        <h3 className="text-muted-foreground relative z-10 text-sm">
          Subscriptions
        </h3>
        <Button
          variant="outline"
          size="icon"
          disabled={generatePortalLink.isPending}
          onClick={() => generatePortalLink.mutate()}
        >
          {generatePortalLink.isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <CreditCard />
          )}
        </Button>
      </div>
      <DataTable
        isLoading={isPending}
        columns={columns}
        data={subscriptionsList || []}
        expandedRows={expandedRows}
        renderExpandedRow={(row: Row<Subscription>) => (
          <SubscriptionDetailsPanel sub={row.original} />
        )}
      />
    </div>
  );
};
