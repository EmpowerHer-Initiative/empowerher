"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons/logo";

export const AccountDeletedContent = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-gradient-to-b from-[#f0f8ff] via-white to-white">
      <div className="relative z-10 p-8">
        <Link href="/">
          <Logo className="size-10 text-[#43a9e2] transition-opacity duration-200 hover:opacity-80" />
        </Link>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <svg
            className="size-7 text-[#43a9e2]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Your account has been deleted
        </h1>
        <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed">
          All your data has been permanently removed. We&apos;re sorry to see
          you go.
        </p>
        <div className="mt-8">
          <Button
            render={<Link href="/" />}
            className="rounded-xl bg-[#43a9e2] px-6 transition-[box-shadow,transform] duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#2d96d4] hover:shadow-[0_4px_20px_rgba(67,169,226,0.35)]"
          >
            Back to home
          </Button>
        </div>
      </div>

      <div className="text-muted-foreground relative z-10 p-8 text-center text-sm">
        Changed your mind?{" "}
        <Link
          href="/signup"
          className="text-[#43a9e2] underline-offset-2 transition-colors hover:underline"
        >
          Create a new account
        </Link>
        .
      </div>
    </div>
  );
};
