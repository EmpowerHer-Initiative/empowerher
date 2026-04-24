"use client";

import Link from "next/link";
import { notFound, redirect, useSearchParams } from "next/navigation";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { isFeatureEnabled } from "@/config/features";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function SuccessPage() {
  if (!isFeatureEnabled("payments")) notFound();

  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  if (!sessionId) redirect("/");

  const trpc = useTRPC();
  const { data, isLoading, isError } = useQuery(
    trpc.billing.verifyCheckout.queryOptions({ sessionId })
  );

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6 text-center">
          <Spinner />
          <p className="text-muted-foreground text-sm">
            Verifying your payment…
          </p>
        </div>
      </div>
    );
  }

  const isSuccess =
    data?.status === "complete" && data?.paymentStatus === "paid";

  if (isError || !isSuccess) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="text-xl font-semibold">Payment failed</h1>
          <p className="text-muted-foreground text-sm">
            Something went wrong with your payment. Please try again.
          </p>
          <Button render={<Link href="/" />} className="w-full" size="lg">
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-xl font-semibold">Payment successful</h1>
        <p className="text-muted-foreground text-sm">
          Thank you for your purchase. You&apos;re all set.
        </p>
        <Button render={<Link href="/settings" />} className="w-full" size="lg">
          Go to dashboard
        </Button>
      </div>
    </div>
  );
}
