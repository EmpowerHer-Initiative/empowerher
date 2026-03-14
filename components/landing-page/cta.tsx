import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

export const Cta = ({ className }: { className?: string }) => {
  return (
    <section className={cn("dark container max-w-7xl", className)}>
      <div className="bg-muted text-foreground relative flex items-center overflow-hidden rounded-4xl border px-8 pt-14 pb-48 md:px-16 md:py-20 md:pb-14">
        {/* Concentric circle decoration on the right */}
        <div className="pointer-events-none absolute right-0 translate-x-[40%] max-md:translate-y-[90%] md:translate-x-1/2">
          <div className="relative size-96 md:size-150">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`bg-foreground/5 absolute inset-0 rounded-full`}
                style={{
                  inset: `${index * 40}px`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <h2 className="mb-4 text-4xl font-bold tracking-tight italic md:text-5xl">
            Let&apos;s Get In Touch.
          </h2>
          <p className="mb-8 max-w-md text-base">
            Your laboratory instruments should serve you, not the other way
            around. We&apos;re happy to help you.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="rounded-full">
              Book a discovery call
              <ArrowRight />
            </Button>
            <Button size="lg" variant={"outline"} className="rounded-full">
              Test Your Samples
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
