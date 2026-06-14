"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/services/trpc/client";

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
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-[#f0f8ff] via-white to-white p-8">
      <div className="w-full max-w-sm space-y-6 rounded-[2rem] border border-black/[0.06] bg-white px-8 py-10 text-center shadow-[0_4px_32px_rgba(0,0,0,0.06)]">
        {isPending && <Spinner />}

        {isFailed && !isPending && (
          <>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50">
              <svg
                className="size-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Payment unsuccessful
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {!checkoutId
                  ? "No checkout session found. This link may be invalid."
                  : "We couldn't verify your payment. The session may have expired or the payment failed."}
              </p>
            </div>
            <Button
              render={<Link href="/#pricing" />}
              className="w-full rounded-xl bg-[#43a9e2] transition-[box-shadow,transform] duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#2d96d4] hover:shadow-[0_4px_20px_rgba(67,169,226,0.35)]"
              size="lg"
            >
              Try again
            </Button>
          </>
        )}

        {isSuccess && data && (
          <>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#f0f8ff]">
              <svg
                className="size-6 text-[#43a9e2]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Payment successful
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Thank you for your purchase. You&apos;re all set.
              </p>
            </div>
            <div className="space-y-3 rounded-2xl border border-black/[0.06] bg-gray-50/60 px-5 py-4 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium text-gray-900">
                  {data.product?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(data.amount, data.currency)}
                </span>
              </div>
              {data.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-gray-900">
                    {data.customerEmail}
                  </span>
                </div>
              )}
            </div>
            <Button
              render={<Link href="/settings" />}
              className="w-full rounded-xl bg-[#43a9e2] transition-[box-shadow,transform] duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#2d96d4] hover:shadow-[0_4px_20px_rgba(67,169,226,0.35)]"
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
