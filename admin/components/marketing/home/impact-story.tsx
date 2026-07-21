import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";

export const ImpactStory = () => (
  <section className="bg-muted/30 py-28 md:py-40">
    <div className="container">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal asChild>
          <div className="order-2 lg:order-1">
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
              Media Coverage
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">
              EmpowerHer in the News
            </h2>
            <p className="text-muted-foreground mt-6 text-base leading-[1.8]">
              Our mission to empower Afghan girls has been recognized and
              celebrated by local media, amplifying the voices of resilience and
              leadership within our community.
            </p>
            <h3 className="mt-8 font-serif text-2xl leading-tight">
              Featured in Rappahannock News
            </h3>
            <p className="text-muted-foreground mt-3 text-base leading-[1.8]">
              EmpowerHer was featured in a local Virginia newsletter through our
              former partnership with Rappahannock News. This acknowledgment
              underscored our mission to empower Afghan girls and amplify their
              narratives of resilience and leadership within a broader
              community.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/hervoice/featured-writings-from-our-partners"
                className="group bg-primary text-primary-foreground hover:shadow-primary/20 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
              >
                Featured Writings from Our Partners
                <ArrowRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/success-stories"
                className="group border-border/60 text-foreground/70 hover:border-primary hover:bg-primary/5 hover:text-foreground hover:shadow-primary/10 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
              >
                Success Stories
                <ArrowRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>
        <Reveal asChild delay={120}>
          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-[2.5rem]">
              <img
                src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTnBGUBwPQgRrhjkv2mNoAG6Y5KExwBW7Cqs1O"
                alt="EmpowerHer in the news"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
