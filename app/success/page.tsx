"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

import { isFeatureEnabled } from "@/config/features";

import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  if (!isFeatureEnabled("payments")) notFound();

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
