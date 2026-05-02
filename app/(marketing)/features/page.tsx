"use client";

import { useRouter } from "next/navigation";
import { useAccess } from "@/services/auth/hooks/use-access";
import { useCheckout, useSwitchPlan } from "@/services/auth/hooks/use-payments";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

function formatInterval(interval: string | null) {
  if (!interval) return "";
  return `/${interval}`;
}

export default function FeaturesPage() {
  const trpc = useTRPC();
  const router = useRouter();
  const access = useAccess();
  const { data: allProducts, isPending: productsLoading } = useQuery(
    trpc.products.list.queryOptions()
  );
  const checkout = useCheckout();
  const switchPlan = useSwitchPlan();

  if (access.isPending || productsLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!access.data) {
    router.replace("/login?callbackUrl=/features");
    return null;
  }

  const subscriptionProducts = allProducts?.filter((p) => p.isRecurring) ?? [];
  const oneTimeProducts = allProducts?.filter((p) => !p.isRecurring) ?? [];

  // Current subscription's price amount for upgrade/downgrade comparison
  const currentProduct = subscriptionProducts.find(
    (p) => p.priceId === access.currentPlanPriceId
  );
  const currentPriceAmount = currentProduct?.priceAmount ?? 0;

  return (
    <div className="space-y-16">
      <Button disabled={!access.hasPlanOrHigher("basic")}>Basic</Button>
      <Button disabled={!access.hasPlanOrHigher("business")}>Business</Button>
      {/* ─── Subscription Plans ─────────────────────────────────── */}
      {subscriptionProducts.length > 0 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-semibold">Subscription Plans</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {access.hasSubscription
                ? `You're on the ${currentProduct?.name ?? "Unknown"} plan.`
                : "Subscribe to unlock features."}
            </p>
          </div>

          <div className="grid gap-4">
            {subscriptionProducts.map((product) => {
              const isCurrent = product.priceId
                ? access.hasPlanByPriceId(product.priceId)
                : false;
              const isUpgrade =
                access.hasSubscription &&
                product.priceAmount > currentPriceAmount;
              const isDowngrade =
                access.hasSubscription &&
                product.priceAmount < currentPriceAmount;

              return (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{product.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          {formatPrice(
                            product.priceAmount,
                            product.priceCurrency
                          )}
                          <span className="text-muted-foreground text-sm font-normal">
                            {formatInterval(product.recurringInterval)}
                          </span>
                        </span>
                        {isCurrent && (
                          <Badge variant="secondary">Current</Badge>
                        )}
                      </div>
                    </div>
                    {product.description && (
                      <CardDescription>{product.description}</CardDescription>
                    )}
                  </CardHeader>

                  {!isCurrent && (
                    <CardContent>
                      {access.hasSubscription ? (
                        <Button
                          onClick={() =>
                            switchPlan.mutate({
                              subscriptionId:
                                access.activeSubscription!
                                  .stripeSubscriptionId!,
                              newPriceId: product.priceId!,
                              immediate: isUpgrade,
                            })
                          }
                          disabled={switchPlan.isPending}
                          variant={isUpgrade ? "default" : "outline"}
                        >
                          {switchPlan.isPending &&
                          switchPlan.variables?.newPriceId === product.priceId
                            ? "Processing…"
                            : isUpgrade
                              ? `Upgrade to ${product.name}`
                              : `Downgrade to ${product.name}`}
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            checkout.mutate({
                              priceIds: [product.priceId!],
                            })
                          }
                          disabled={checkout.isPending}
                        >
                          {checkout.isPending
                            ? "Redirecting…"
                            : `Subscribe to ${product.name}`}
                        </Button>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── One-Time Products ──────────────────────────────────── */}
      {oneTimeProducts.length > 0 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-semibold">One-Time Purchases</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Purchase once, access forever.
            </p>
          </div>

          <div className="grid gap-4">
            {oneTimeProducts.map((product) => {
              const purchased = product.priceId
                ? access.hasProductByPriceId(product.priceId)
                : false;

              return (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{product.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          {formatPrice(
                            product.priceAmount,
                            product.priceCurrency
                          )}
                        </span>
                        {purchased && (
                          <Badge variant="secondary">Purchased</Badge>
                        )}
                      </div>
                    </div>
                    {product.description && (
                      <CardDescription>{product.description}</CardDescription>
                    )}
                  </CardHeader>

                  {!purchased && (
                    <CardContent>
                      <Button
                        onClick={() =>
                          checkout.mutate({
                            priceIds: [product.priceId!],
                          })
                        }
                        disabled={checkout.isPending}
                      >
                        {checkout.isPending
                          ? "Redirecting…"
                          : `Purchase ${product.name}`}
                      </Button>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── Empty state ────────────────────────────────────────── */}
      {subscriptionProducts.length === 0 && oneTimeProducts.length === 0 && (
        <div className="text-muted-foreground py-16 text-center text-sm">
          <p>No products available.</p>
        </div>
      )}
    </div>
  );
}
