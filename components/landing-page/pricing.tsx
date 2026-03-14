"use client"

import { useState } from "react"
import { Card, CardContent } from "../ui/card"
import { CheckCircle2 } from "lucide-react"
import { Button } from "../ui/button"

const pricingPlans = [
  {
    name: "Basic plan",
    price: "$10",
    periodSub: "per month",
    description: "Basic features for up to 10 users.",
    featuresHeader: "Everything in our free plan plus....",
    features: [
      "Access to basic features",
      "Basic reporting and analytics",
      "Up to 10 individual users",
      "20GB individual data each user",
      "Basic chat and email support",
    ],
    highlighted: false,
  },
  {
    name: "Business plan",
    price: "$20",
    periodSub: "per month",
    description: "Growing teams up to 20 users.",
    featuresHeader: "Everything in Basic plus....",
    features: [
      "200+ integrations",
      "Advanced reporting and analytics",
      "Up to 20 individual users",
      "40GB individual data each user",
      "Priority chat and email support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise plan",
    price: "$40",
    periodSub: "per month",
    description: "Advanced features + unlimited users.",
    featuresHeader: "Everything in Business plus....",
    features: [
      "Advanced custom fields",
      "Audit log and data history",
      "Unlimited individual users",
      "Unlimited individual data",
      "Personalised+priority service",
    ],
    highlighted: false,
  },
]

export const Pricing = () => {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly")

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <div className="mb-16">
        <h2 className="mb-4 max-w-xl text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          We&apos;ve got a plan
          <br />
          that&apos;s perfect for you
        </h2>
        <div className="mt-8 inline-flex items-center rounded-full border border-border bg-muted/50 p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              billing === "monthly"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly billing
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              billing === "annual"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annual billing
          </button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col overflow-hidden rounded-2xl ${
              plan.highlighted ? "dark shadow-dialog" : "shadow-card"
            }`}
          >
            {/* Dark header */}
            <div className="px-6 pt-6 pb-6">
              <div className="mb-4 flex items-center gap-3">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                {plan.highlighted && (
                  <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                    Popular
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{plan.price}</span>
                <div className="flex flex-col text-sm text-muted-foreground">
                  <span>{plan.periodSub}</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <Button className="w-full rounded-lg py-5 text-sm font-semibold">
                  Get started
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-lg bg-transparent py-5 text-sm font-semibold"
                >
                  Chat to sales
                </Button>
              </div>
            </div>

            {/* Features section */}
            <CardContent className="flex flex-1 flex-col px-6 pt-6 pb-6">
              <p className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Features
              </p>
              <p className="mb-4 text-sm text-muted-foreground">
                {plan.featuresHeader}
              </p>
              <ul className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
