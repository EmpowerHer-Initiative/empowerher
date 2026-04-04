"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { BgPattern } from "@/components/bg-pattern";
import { Logo } from "@/components/icons/logo";
import { siteConfig } from "@/lib/site";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="bg-background fixed inset-0 z-50 flex flex-col overflow-hidden">
      <BgPattern />

      {/* Top-left logo */}
      <div className="p-8">
        <Link href="/">
          <Logo className="text-primary size-8" />
        </Link>
      </div>

      {/* Centered content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        {/* Giant background number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute select-none"
          aria-hidden
        >
          <span className="text-muted/30 text-[clamp(12rem,40vw,28rem)] leading-none font-black tracking-tighter">
            404
          </span>
        </motion.div>

        {/* Foreground text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative space-y-4"
        >
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Page not found
          </h1>
          <p className="text-muted-foreground mx-auto max-w-sm text-lg">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center justify-center gap-3 pt-2"
          >
            <Button variant="outline" onClick={() => router.back()}>
              Go back
            </Button>
            <Button render={<Link href="/" />}>Take me home</Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="text-muted-foreground p-8 text-center text-sm"
      >
        If you think this is a mistake,{" "}
        <Link
          href={`mailto:${siteConfig.email}`}
          className="hover:text-foreground underline underline-offset-4 transition-colors"
        >
          contact support
        </Link>
        .
      </motion.div>
    </div>
  );
};

export default NotFound;
