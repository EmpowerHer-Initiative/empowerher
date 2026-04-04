"use client";

import { useState } from "react";
import { useCheckout } from "@/services/auth/hooks/use-payments";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

import { motionInView } from "@/lib/utils";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const formatPrice = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);

const intervalLabel: Record<string, string> = {
  day: "per day",
  week: "per week",
  month: "per month",
  year: "per year",
};

const extractFeaturesFromMarkdown = (markdown: string): string[] =>
  markdown
    .split(/\\n|\n/)
    .filter((line) => /^[-*]\s+/.test(line.trim()))
    .map((line) =>
      line
        .trim()
        .replace(/^[-*]\s+/, "")
        .trim()
    )
    .filter(Boolean);

export const Pricing = () => {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const trpc = useTRPC();
  const { mutate: checkout, isPending: isCheckingOut } = useCheckout();
  const { data: allProducts, isPending, isError } = useQuery(
    trpc.payments.getProducts.queryOptions()
  );

  const targetInterval = billing === "monthly" ? "month" : "year";
  const products =
    allProducts?.filter(
      (p) => !p.isArchived && p.recurringInterval === targetInterval
    ) ?? [];

  return (
    <motion.div
      id="pricing"
      className="container scroll-mt-24"
      variants={motionInView}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <div className="mb-16">
        <h2 className="mb-4 max-w-xl text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          We&apos;ve got a plan
          <br />
          that&apos;s perfect for you
        </h2>
        <div className="border-border bg-muted/50 mt-8 inline-flex items-center rounded-full border p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              billing === "monthly"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly billing
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              billing === "annual"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annual billing
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {isPending ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-64 animate-pulse" />
          ))
        ) : isError ? (
          <p className="text-muted-foreground col-span-full text-center">
            Unable to load plans. Please refresh the page and try again.
          </p>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center">
            No plans available at the moment.
          </p>
        ) : (
          products.map((plan) => {
              const features = plan.description
                ? extractFeaturesFromMarkdown(plan.description)
                : [];

              return (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col overflow-hidden rounded-2xl ${
                    plan.popular
                      ? "dark shadow-dialog dark:bg-muted dark:text-foreground"
                      : "shadow-card"
                  }`}
                >
                  <div className="px-6 pt-6 pb-6">
                    <div className="mb-4 flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      {plan.popular && (
                        <span className="bg-primary text-primary-foreground rounded-full px-3 py-0.5 text-xs font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">
                        {formatPrice(plan.priceAmount, plan.priceCurrency)}
                      </span>
                      <div className="text-muted-foreground flex flex-col text-sm">
                        <span>
                          {plan.recurringInterval
                            ? intervalLabel[plan.recurringInterval]
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-col gap-3">
                      <Button
                        className="w-full rounded-lg py-5 text-sm font-semibold"
                        disabled={isCheckingOut}
                        onClick={() => checkout({ productId: plan.id })}
                      >
                        {isCheckingOut ? "Redirecting..." : "Get started"}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full rounded-lg bg-transparent py-5 text-sm font-semibold"
                        render={<a href="mailto:a@alisamadii.com" />}
                      >
                        Chat to sales
                      </Button>
                    </div>
                  </div>

                  {features.length > 0 && (
                    <CardContent className="flex flex-1 flex-col px-6 pt-0 pb-6">
                      <p className="text-muted-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
                        Features
                      </p>
                      <ul className="flex-1 space-y-3">
                        {features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-3 text-sm"
                          >
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              );
            })
        )}
      </div>
    </motion.div>
  );
};
