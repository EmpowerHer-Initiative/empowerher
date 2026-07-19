import Link from "next/link";
import { Heart } from "lucide-react";

import { Reveal } from "@/components/reveal";

export const ClosingCTA = () => (
  <section className="pb-28 md:pb-40">
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal asChild>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Be Part of the Next Story
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h2 className="mt-5 font-serif text-3xl md:text-5xl">
            Want to support more stories like this?
          </h2>
        </Reveal>
        <Reveal asChild delay={160}>
          <div className="mt-10">
            <Link
              href="/get-involved"
              className="group bg-primary text-primary-foreground hover:shadow-primary/25 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg active:scale-[0.98]"
            >
              <Heart className="size-4" />
              Get Involved
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
