"use client";

import { useEffect } from "react";
import Link from "next/link";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useCheckout } from "@/services/auth/hooks/use-payments";

import { isFeatureEnabled } from "@/config/features";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function CheckoutPage() {
  if (!isFeatureEnabled("payments")) notFound();

  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const { mutate: checkout, isError } = useCheckout();

  useEffect(() => {
    if (!productId) {
      router.replace("/");
      return;
    }
    checkout({ productId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isError) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium">Something went wrong</p>
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t redirect you to checkout. Please try again.
        </p>
        <Button render={<Link href="/#pricing" />}>Back to pricing</Button>
      </div>
    );
  }

  if (!productId) return null;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <Spinner className="size-8" />
      <p className="text-muted-foreground text-sm">Redirecting to checkout…</p>
    </div>
  );
}
