import { useParams } from "next/navigation";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Braces } from "lucide-react";

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

export const Subscriptions = () => {
  const { id } = useParams<{ id: string }>();

  const trpc = useTRPC();
  const { data: user } = useQuery(
    trpc.admin.users.getById.queryOptions(id, {
      enabled: !!id,
    })
  );

  const { data: subscriptions, isPending } = useQuery(
    trpc.payments.getSubscriptions.queryOptions(
      {
        userId: user?.id || "",
      },
      {
        enabled: !!user?.id,
      }
    )
  );

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
                {row.original.id.slice(0, 12)}…
              </Badge>
            ),
          },
          {
            id: "plan",
            header: "Plan",
            cell: ({ row }) => (
              <Badge variant="outline" className="capitalize">
                {row.original.plan}
              </Badge>
            ),
          },
          {
            id: "status",
            header: "Status",
            cell: ({ row }) => (
              <Badge
                variant={
                  row.original.status === "active" ? "default" : "destructive"
                }
              >
                {row.original.status}
              </Badge>
            ),
          },
          {
            id: "interval",
            header: "Interval",
            cell: ({ row }) => (
              <span className="capitalize">
                {row.original.billingInterval ?? "-"}
              </span>
            ),
          },
          {
            id: "cancelAtPeriodEnd",
            header: "Cancel At Period End",
            cell: ({ row }) => (
              <code className="text-xs">
                {JSON.stringify(row.original.cancelAtPeriodEnd)}
              </code>
            ),
          },
          {
            id: "period_end",
            header: "Period End",
            cell: ({ row }) => (
              <span>
                {row.original.periodEnd
                  ? format(
                      new Date(row.original.periodEnd),
                      "MM/dd/yyyy hh:mm a"
                    )
                  : "-"}
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
                    <DialogTitle>Subscription Details</DialogTitle>
                  </DialogHeader>
                  <FormattedJSON data={row.original} />
                </DialogContent>
              </Dialog>
            ),
          },
        ]}
        data={subscriptions || []}
      />
    </div>
  );
};
