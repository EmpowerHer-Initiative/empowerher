"use client";

import { useState } from "react";
import { useCheckout } from "@/services/auth/hooks/use-payments";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Check, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

const formatPrice = (amount: number, currency: string = "usd") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100);

export default function TestingPricingPage() {
  const trpc = useTRPC();
  const {
    data: products,
    isPending,
    isError,
  } = useQuery(trpc.products.list.queryOptions());
  const checkout = useCheckout();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = (priceId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(priceId)) {
        next.delete(priceId);
      } else {
        next.add(priceId);
      }
      return next;
    });
  };

  const selectedTotal =
    products
      ?.filter((p) => p.priceId && selected.has(p.priceId))
      .reduce((sum, p) => sum + p.priceAmount, 0) ?? 0;

  if (isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isError || !products) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-muted-foreground">Failed to load products.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">No products found</p>
        <p className="text-muted-foreground text-sm">
          Create products in your{" "}
          <a
            href="https://dashboard.stripe.com/products"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Stripe Dashboard
          </a>{" "}
          and they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Pricing</h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Choose the plan that works for you.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const isSelected = !!product.priceId && selected.has(product.priceId);

          return (
            <Card
              key={product.id}
              className={cn(
                "relative flex cursor-pointer flex-col transition-all",
                isSelected && "ring-primary ring-2"
              )}
              onClick={() => product.priceId && toggleSelect(product.priceId)}
            >
              {isSelected && (
                <div className="bg-primary absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full text-white">
                  <Check className="size-4" />
                </div>
              )}
              {product.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="space-y-2 pb-4">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">
                    {formatPrice(product.priceAmount, product.priceCurrency)}
                  </span>
                  {product.recurringInterval && (
                    <span className="text-muted-foreground text-sm">
                      /{product.recurringInterval}
                    </span>
                  )}
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="flex-1 pt-6">
                {product.description && (
                  <p className="text-muted-foreground mb-6 text-sm">
                    {product.description}
                  </p>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  variant={isSelected ? "outline" : "default"}
                  disabled={!product.priceId}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product.priceId) toggleSelect(product.priceId);
                  }}
                >
                  {isSelected ? "Selected" : "Select"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {selected.size > 0 && (
        <div className="bg-background fixed right-0 bottom-0 left-0 border-t p-4 shadow-lg">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="text-muted-foreground size-5" />
              <span className="text-sm font-medium">
                {selected.size} plan{selected.size > 1 ? "s" : ""} selected
              </span>
              <span className="text-muted-foreground text-sm">
                {formatPrice(selectedTotal)}/mo
              </span>
            </div>
            <Button
              size="lg"
              disabled={checkout.isPending}
              onClick={() =>
                checkout.mutate({ priceIds: Array.from(selected) })
              }
            >
              {checkout.isPending ? "Redirecting…" : "Checkout"}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-12 rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Debug Info</h2>
        <pre className="text-muted-foreground overflow-auto text-xs">
          {JSON.stringify(products, null, 2)}
        </pre>
      </div>
    </div>
  );
}
