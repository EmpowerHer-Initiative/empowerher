import { useState } from "react";
import {
  useCheckout,
  useGeneratePortalLink,
  useGetCustomerState,
  useSwitchPlan,
} from "@/services/auth/hooks/use-payments";
import { useCurrentUser } from "@/services/auth/hooks/use-user";
import { queryClient, useTRPC } from "@/services/trpc/client";
import type { RouterOutputs } from "@/services/trpc/routers/_app";
import { useQuery } from "@tanstack/react-query";
import { addMonths, addYears, format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/data-table";

export const BillingSubscriptions = () => {
  const { data: user } = useCurrentUser();
  const trpc = useTRPC();
  const {
    data: subscriptions,
    isPending,
    isError,
    error,
  } = useQuery(
    trpc.payments.getSubscriptions.queryOptions(
      {
        userId: user?.user.id || "",
      },
      {
        enabled: !!user?.user.id,
      }
    )
  );
  const getProducts = useQuery(trpc.payments.getProducts.queryOptions());

  const getNextBillingDate = (
    subscription: RouterOutputs["payments"]["getSubscriptions"][number]
  ) => {
    if (!subscription.startedAt) return null;
    const startDate = new Date(subscription.startedAt);
    const interval = subscription.recurringInterval;
    if (interval === "month") return addMonths(startDate, 1);
    if (interval === "year") return addYears(startDate, 1);
    return null;
  };

  const formatCurrency = (amount: number, currency: string = "usd") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="space-y-8">
      {/* Subscriptions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-muted-foreground text-sm">Subscriptions</h3>
          <PortalButton />
        </div>
        {isError ? (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load subscriptions.{" "}
              {error?.message && (
                <span className="text-muted-foreground text-xs">
                  {error.message}
                </span>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <DataTable
            isLoading={isPending || getProducts.isPending}
            columns={[
              {
                id: "plan",
                header: "Plan",
                cell: ({ row }) => {
                  const product = getProducts.data?.find(
                    (product) => product.id === row.original.productId
                  );
                  return (
                    <div className="flex flex-col">
                      <Badge variant="outline" className="w-fit">
                        {product?.name.replace("month", "").replace("year", "")}
                      </Badge>
                      {row.original.status === "trialing" && (
                        <Badge
                          variant="secondary"
                          className="mt-1 w-fit text-xs"
                        >
                          Trial
                        </Badge>
                      )}
                    </div>
                  );
                },
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
                id: "amount",
                header: "Amount",
                cell: ({ row }) => (
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {formatCurrency(
                        row.original.amount,
                        row.original.currency
                      )}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      /{row.original.recurringInterval}
                    </span>
                  </div>
                ),
              },
              {
                id: "next_billing",
                header: "Next Billing",
                cell: ({ row }) => {
                  const nextBilling = getNextBillingDate(row.original);
                  return (
                    <span className="flex flex-col">
                      <span className="text-sm">
                        {nextBilling
                          ? format(nextBilling, "MMM dd, yyyy")
                          : "-"}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {nextBilling
                          ? formatDistanceToNow(nextBilling, {
                              addSuffix: true,
                            })
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
              {
                id: "created_at",
                header: "Created",
                cell: ({ row }) => (
                  <span className="text-sm">
                    {row.original.createdAt
                      ? format(row.original.createdAt, "MMM dd, yyyy")
                      : "-"}
                  </span>
                ),
              },
            ]}
            data={subscriptions || []}
          />
        )}
      </div>

      {/* Plans */}
      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm">Plans</h3>
        <div className="divide-y">
          {getProducts.data
            ?.filter((product) => !product.isArchived)
            .map((product) => (
              <EachProduct key={product.id} product={product} />
            ))}
        </div>
      </div>
    </div>
  );
};

interface EachProductProps {
  product: RouterOutputs["payments"]["getProducts"][number];
}

const EachProduct = ({ product }: EachProductProps) => {
  const [open, setOpen] = useState(false);
  const [immediateUpdate, setImmediateUpdate] = useState(false);

  const { data } = useGetCustomerState();
  const checkout = useCheckout();
  const switchPlan = useSwitchPlan();

  const trpc = useTRPC();
  const products = useQuery(trpc.payments.getProducts.queryOptions());
  const filteredProducts = products.data?.filter((p) => !p.isArchived) || [];
  const currentProduct = filteredProducts.find(
    (p) => p.id === data?.currentProductId
  );

  const isDowngrade = currentProduct
    ? product.priceAmount < currentProduct.priceAmount
    : false;

  const handleUpgrade = (
    product: RouterOutputs["payments"]["getProducts"][number]
  ) => {
    if (data?.isUserHaveAccess) {
      switchPlan.mutate(
        {
          subscriptionId: data?.currentSubscriptionId || "",
          toProductId: product.id,
          prorationBehavior: immediateUpdate ? "invoice" : "prorate",
        },
        {
          onSuccess: () => {
            setOpen(false);
            toast.success("Plan updated successfully");
            setTimeout(() => {
              queryClient.invalidateQueries({
                queryKey: trpc.payments.getSubscriptions.queryKey(),
              });
              queryClient.invalidateQueries({
                queryKey: trpc.payments.getCustomerState.queryKey(),
              });
            }, 2000);
          },
          onError: (error) => {
            toast.error(error.message || "Failed to switch plan");
          },
        }
      );
    } else {
      checkout.mutate({
        productId: product.id,
        successUrl: "/portfolio",
      });
    }
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-col">
        <h3>
          {product.name}{" "}
          <span className="text-muted-foreground text-sm">
            {product.priceAmount / 100}/{product.recurringInterval}
          </span>
        </h3>
        <p className="text-muted-foreground text-sm whitespace-pre-line">
          {product.description}
        </p>
      </div>
      {data?.currentProductId !== product.id ? (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            render={<Button>{isDowngrade ? "Downgrade" : "Upgrade"}</Button>}
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isDowngrade ? "Downgrade" : "Upgrade"}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className={cn("space-y-4", isDowngrade && "opacity-50")}>
              <p className="text-muted-foreground text-sm">
                Choose when you want your plan to be updated:
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="immediate-update"
                  checked={immediateUpdate}
                  onCheckedChange={(checked) =>
                    setImmediateUpdate(checked as boolean)
                  }
                  disabled={isDowngrade}
                />
                <label
                  htmlFor="immediate-update"
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Apply changes immediately
                </label>
              </div>
              <p className="text-muted-foreground text-xs">
                {immediateUpdate
                  ? "Your plan will be updated immediately and you'll be charged the prorated amount."
                  : "Your plan will be updated at your next billing cycle. No immediate charges."}
              </p>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                render={<Button variant="outline">Cancel</Button>}
              />
              <Button
                onClick={() => handleUpgrade(product)}
                disabled={switchPlan.isPending || checkout.isPending}
              >
                {switchPlan.isPending || checkout.isPending
                  ? "Processing..."
                  : isDowngrade
                    ? "Downgrade"
                    : "Upgrade"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button
          variant={
            data?.currentProductId === product.id ? "outline" : undefined
          }
          disabled={data?.currentProductId === product.id}
          onClick={() => handleUpgrade(product)}
        >
          {data?.currentProductId === product.id
            ? "Current Plan"
            : data?.isUserHaveAccess
              ? "Upgrade"
              : "Purchase"}
        </Button>
      )}
    </div>
  );
};

const PortalButton = () => {
  const generatePortalLink = useGeneratePortalLink();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => generatePortalLink.mutate()}
      disabled={generatePortalLink.isPending}
    >
      {generatePortalLink.isPending ? "Loading..." : "Manage Billing"}
    </Button>
  );
};
