"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { AlertCircleIcon } from "lucide-react";
import { motion, useAnimate } from "motion/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { HandCheck } from "@/components/icons";

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

  const [cardRef, animateCard] = useAnimate();

  // Confetti burst on success
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

  // Shake card on failure after the enter animation settles
  useEffect(() => {
    if (!isFailed || isPending) return;
    animateCard(
      cardRef.current,
      { x: [0, -14, 14, -10, 10, -5, 5, 0] },
      { duration: 0.55, ease: "easeOut", delay: 0.45 }
    );
  }, [isFailed, isPending]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-muted flex min-h-dvh items-center justify-center p-8">
      <motion.div
        ref={cardRef}
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card>
          <CardContent className="flex flex-col items-center gap-6 pt-8 text-center">
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
                <motion.div
                  className="bg-destructive/10 flex size-16 items-center justify-center rounded-full"
                  initial={{ scale: 0, rotate: 15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 18,
                    delay: 0.15,
                  }}
                >
                  <AlertCircleIcon className="text-destructive size-8" />
                </motion.div>
                <motion.div
                  className="space-y-1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                >
                  <h1 className="text-xl font-semibold">
                    Payment unsuccessful
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {!checkoutId
                      ? "No checkout session found. This link may be invalid."
                      : "We couldn't verify your payment. The session may have expired or the payment failed."}
                  </p>
                </motion.div>
                <Separator />
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.35 }}
                >
                  <Button
                    render={<Link href="/#pricing" />}
                    className="w-full"
                    size="lg"
                  >
                    Try again
                  </Button>
                </motion.div>
              </>
            )}

            {isSuccess && data && (
              <>
                <motion.div
                  className="bg-primary/10 flex size-16 items-center justify-center rounded-full"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 14,
                    delay: 0.15,
                  }}
                >
                  <HandCheck className="text-primary size-8" />
                </motion.div>

                <motion.div
                  className="space-y-1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <h1 className="text-xl font-semibold">Payment successful!</h1>
                  <p className="text-muted-foreground text-sm">
                    Thank you for your purchase. You&apos;re all set.
                  </p>
                </motion.div>

                <Separator />

                <motion.div
                  className="w-full space-y-3 text-sm"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
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
                </motion.div>

                <Separator />

                <motion.div
                  className="w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Button
                    render={<Link href="/settings" />}
                    className="w-full"
                    size="lg"
                  >
                    Go to dashboard
                  </Button>
                </motion.div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
