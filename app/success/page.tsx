"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const formatPrice = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);

export default function SuccessPage() {
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

  useEffect(() => {
    if (!isSuccess) return;

    const end = Date.now() + 3000;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#a855f7", "#6366f1", "#3b82f6"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ec4899", "#f97316", "#eab308"],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  }, [isSuccess]);

  return (
    <div className="bg-muted flex min-h-dvh items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-6 pt-8 pb-8 text-center">
          {isPending && (
            <>
              <Skeleton className="size-16 rounded-full" />
              <div className="w-full space-y-2">
                <Skeleton className="mx-auto h-6 w-48" />
                <Skeleton className="mx-auto h-4 w-64" />
              </div>
              <Separator />
              <div className="w-full space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-10 w-full" />
            </>
          )}

          {isFailed && !isPending && (
            <>
              <div className="bg-destructive/10 flex size-16 items-center justify-center rounded-full">
                <AlertCircleIcon className="text-destructive size-8" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-semibold">Payment unsuccessful</h1>
                <p className="text-muted-foreground text-sm">
                  {!checkoutId
                    ? "No checkout session found. This link may be invalid."
                    : "We couldn't verify your payment. The session may have expired or the payment failed."}
                </p>
              </div>
              <Separator />
              <Button render={<Link href="/#pricing" />} className="w-full">
                Try again
              </Button>
            </>
          )}

          {isSuccess && data && (
            <>
              <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
                <CheckCircle2Icon className="text-primary size-8" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-semibold">Payment successful!</h1>
                <p className="text-muted-foreground text-sm">
                  Thank you for your purchase. You&apos;re all set.
                </p>
              </div>
              <Separator />
              <div className="w-full space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">{data.product?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    {formatPrice(data.amount, data.currency)}
                  </span>
                </div>
                {data.customerEmail && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{data.customerEmail}</span>
                  </div>
                )}
              </div>
              <Separator />
              <Button render={<Link href="/settings" />} className="w-full">
                Go to dashboard
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
