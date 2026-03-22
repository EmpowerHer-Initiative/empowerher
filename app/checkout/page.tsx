"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCheckout } from "@/services/auth/hooks/use-payments";

import { Spinner } from "@/components/ui/spinner";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const { mutate: checkout } = useCheckout();

  useEffect(() => {
    if (!productId) {
      router.replace("/");
      return;
    }
    checkout({ productId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <Spinner className="size-8" />
      <p className="text-muted-foreground text-sm">Redirecting to checkout…</p>
    </div>
  );
}
