"use client";

import {
  useCheckout,
  useGetCustomerState,
  useSwitchPlan,
} from "@/services/auth/hooks/use-payments";
import { useCurrentUser } from "@/services/auth/hooks/use-user";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";

export const BillingSubscriptions = () => {
  const { data: user } = useCurrentUser();
  const trpc = useTRPC();
  const { data: subscriptions, isPending } = useQuery(
    trpc.payments.getSubscriptions.queryOptions(
      {
        userId: user?.user.id || "",
      },
      {
        enabled: !!user?.user.id,
      }
    )
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriptions</CardTitle>
      </CardHeader>
      <DataTable
        isLoading={isPending}
        columns={[
          {
            id: "plan",
            header: "Plan",
            cell: ({ row }) => (
              <div className="flex flex-col">
                <Badge variant="outline" className="w-fit capitalize">
                  {row.original.plan}
                </Badge>
                {row.original.status === "trialing" && (
                  <Badge variant="secondary" className="mt-1 w-fit text-xs">
                    Trial
                  </Badge>
                )}
              </div>
            ),
          },
          {
            id: "status",
            header: "Status",
            cell: ({ row }) => (
              <Badge
                variant={
                  row.original.status === "active" ||
                  row.original.status === "trialing"
                    ? "default"
                    : row.original.status === "canceled"
                      ? "destructive"
                      : "secondary"
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
              <span className="text-sm capitalize">
                {row.original.billingInterval ?? "-"}
              </span>
            ),
          },
          {
            id: "period_end",
            header: "Next Billing",
            cell: ({ row }) => {
              const end = row.original.periodEnd;
              return (
                <span className="flex flex-col">
                  <span className="text-sm">
                    {end ? format(new Date(end), "MMM dd, yyyy") : "-"}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {end
                      ? formatDistanceToNow(new Date(end), { addSuffix: true })
                      : "-"}
                  </span>
                </span>
              );
            },
          },
          {
            id: "auto_renewal",
            header: "Auto-Renewal",
            cell: ({ row }) => (
              <Badge
                variant={
                  row.original.cancelAtPeriodEnd ? "destructive" : "default"
                }
              >
                {row.original.cancelAtPeriodEnd ? "Off" : "On"}
              </Badge>
            ),
          },
        ]}
        data={subscriptions || []}
      />
      <UpgradeSection />
    </Card>
  );
};

const UpgradeSection = () => {
  const { data } = useGetCustomerState();
  const checkout = useCheckout();
  const switchPlan = useSwitchPlan();

  const handleUpgrade = (priceId: string) => {
    checkout.mutate({ priceIds: [priceId] });
  };

  return (
    <>
      <CardHeader>Upgrade</CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Configure your plans in <code>services/auth/auth.ts</code> under the
          Stripe plugin&apos;s <code>subscription.plans</code> array with your
          Stripe price IDs.
        </p>
        {/* Example buttons — replace with your actual plan config:
        <div className="mt-4 flex gap-2">
          <Button onClick={() => handleUpgrade("basic")}>
            {data?.currentPlan === "basic" ? "Current Plan" : "Basic"}
          </Button>
          <Button onClick={() => handleUpgrade("pro")}>
            {data?.currentPlan === "pro" ? "Current Plan" : "Pro"}
          </Button>
        </div>
        */}
      </CardContent>
    </>
  );
};
