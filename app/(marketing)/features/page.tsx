"use client";

import { useQuery } from "@tanstack/react-query";

import { useAccess } from "@/services/auth/hooks/use-access";
import { useCheckout } from "@/services/auth/hooks/use-payments";
import { useTRPC } from "@/services/trpc/client";

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
import { Reveal } from "@/components/reveal";

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
  const access = useAccess();
  const {
    data: allProducts,
    isPending: productsLoading,
    isError,
  } = useQuery(trpc.products.list.queryOptions());
  const checkout = useCheckout();

  if (access.isPending || productsLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-muted-foreground">Failed to load products.</p>
      </div>
    );
  }

  const subscriptionProducts = allProducts?.filter((p) => p.isRecurring) ?? [];
  const oneTimeProducts = allProducts?.filter((p) => !p.isRecurring) ?? [];

  return (
    <div className="space-y-16">
      <Button disabled={!access.hasPlanOrHigher("starter")}>Basic</Button>
      <Button disabled={!access.hasPlanOrHigher("pro")}>Pro</Button>
      <Button disabled={!access.hasPlanOrHigher("enterprise")}>
        Enterprise
      </Button>
      {/* ─── Subscription Plans ─────────────────────────────────── */}
      {subscriptionProducts.length > 0 && (
        <section className="space-y-6">
          <Reveal asChild>
            <div>
              <h2 className="text-3xl font-semibold">Subscription Plans</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {access.hasSubscription
                  ? "You have an active subscription."
                  : "Subscribe to unlock features."}
              </p>
            </div>
          </Reveal>

          <Reveal asChild delay={80}>
            <div className="grid gap-4">
              {subscriptionProducts.map((product) => {
                const isCurrent = access.hasPlanByProductId(product.id);

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
                        <Button
                          onClick={() =>
                            checkout.mutate({ productId: product.id })
                          }
                          disabled={checkout.isPending}
                        >
                          {checkout.isPending
                            ? "Redirecting…"
                            : `Subscribe to ${product.name}`}
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </Reveal>
        </section>
      )}

      {/* ─── One-Time Products ──────────────────────────────────── */}
      {oneTimeProducts.length > 0 && (
        <section className="space-y-6">
          <Reveal asChild>
            <div>
              <h2 className="text-3xl font-semibold">One-Time Purchases</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Purchase once, access forever.
              </p>
            </div>
          </Reveal>

          <Reveal asChild delay={80}>
            <div className="grid gap-4">
              {oneTimeProducts.map((product) => {
                const purchased = access.hasProductByProductId(product.id);

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
                            checkout.mutate({ productId: product.id })
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
          </Reveal>
        </section>
      )}

      {/* ─── Empty state ────────────────────────────────────────── */}
      {subscriptionProducts.length === 0 && oneTimeProducts.length === 0 && (
        <Reveal asChild>
          <div className="text-muted-foreground py-16 text-center text-sm">
            <p>No products available.</p>
          </div>
        </Reveal>
      )}
    </div>
  );
}
