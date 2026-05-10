"use client";

import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { isFeatureEnabled } from "@/config/features";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const formatPrice = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);

export default function SuccessPage() {
  if (!isFeatureEnabled("payments")) notFound();

  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");

  const trpc = useTRPC();
  const { data, isPending, isError } = useQuery({
    ...trpc.payments.getCheckoutSession.queryOptions(checkoutId ?? ""),
    enabled: !!checkoutId,
  });

  const isSuccess =
    data?.status === "confirmed" || data?.status === "succeeded";
  const isFailed =
    !checkoutId ||
    isError ||
    (!!data && data.status !== "confirmed" && data.status !== "succeeded");

  return (
    <div className="flex min-h-dvh items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-6 text-center">
        {isPending && <Spinner />}

        {isFailed && !isPending && (
          <>
            <h1 className="text-xl font-semibold">Payment unsuccessful</h1>
            <p className="text-muted-foreground text-sm">
              {!checkoutId
                ? "No checkout session found. This link may be invalid."
                : "We couldn't verify your payment. The session may have expired or the payment failed."}
            </p>
            <Button
              render={<Link href="/#pricing" />}
              className="w-full"
              size="lg"
            >
              Try again
            </Button>
          </>
        )}

        {isSuccess && data && (
          <>
            <h1 className="text-xl font-semibold">Payment successful</h1>
            <p className="text-muted-foreground text-sm">
              Thank you for your purchase. You&apos;re all set.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">{data.product?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">
                  {formatPrice(data.amount, data.currency)}
                </span>
              </div>
              {data.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{data.customerEmail}</span>
                </div>
              )}
            </div>
            <Button
              render={<Link href="/settings" />}
              className="w-full"
              size="lg"
            >
              Go to dashboard
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
