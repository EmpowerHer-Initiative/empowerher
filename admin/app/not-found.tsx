"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/lib/site";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons/logo";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="bg-background fixed inset-0 z-50 flex flex-col overflow-hidden">
      {/* Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
      >
        <span className="text-[20rem] leading-none font-black tracking-tighter text-[#43a9e2]/[0.04]">
          404
        </span>
      </div>

      <div className="relative z-10 p-8">
        <Link href="/">
          <Logo className="size-12 text-[#43a9e2] transition-opacity duration-200 hover:opacity-80" />
        </Link>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Page not found
        </h1>
        <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-xl border-black/10 px-5 transition-[box-shadow,transform] duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
          >
            Go back
          </Button>
          <Button
            render={<Link href="/" />}
            className="rounded-xl bg-[#43a9e2] px-5 transition-[box-shadow,transform] duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#2d96d4] hover:shadow-[0_4px_20px_rgba(67,169,226,0.35)]"
          >
            Take me home
          </Button>
        </div>
      </div>

      <div className="text-muted-foreground relative z-10 p-8 text-center text-sm">
        If you think this is a mistake,{" "}
        <Link
          href={`mailto:${siteConfig.email}`}
          className="text-[#43a9e2] underline-offset-2 transition-colors hover:underline"
        >
          contact support
        </Link>
        .
      </div>
    </div>
  );
};

export default NotFound;
