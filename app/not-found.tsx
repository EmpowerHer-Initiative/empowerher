"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/lib/site";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons/logo";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="bg-background fixed inset-0 z-50 flex flex-col">
      <div className="p-8">
        <Link href="/">
          <Logo className="size-8" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Go back
          </Button>
          <Button render={<Link href="/" />}>Take me home</Button>
        </div>
      </div>

      <div className="text-muted-foreground p-8 text-center text-sm">
        If you think this is a mistake,{" "}
        <Link href={`mailto:${siteConfig.email}`} className="underline">
          contact support
        </Link>
        .
      </div>
    </div>
  );
};

export default NotFound;
