"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons/logo";

export const AccountDeletedContent = () => {
  return (
    <div className="bg-background fixed inset-0 z-50 flex flex-col">
      <div className="p-8">
        <Link href="/">
          <Logo className="size-8" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold">Your account has been deleted</h1>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          All your data has been permanently removed. We&apos;re sorry to see
          you go.
        </p>
        <div className="mt-6">
          <Button render={<Link href="/" />}>Back to home</Button>
        </div>
      </div>

      <div className="text-muted-foreground p-8 text-center text-sm">
        Changed your mind?{" "}
        <Link href="/signup" className="underline">
          Create a new account
        </Link>
        .
      </div>
    </div>
  );
};
