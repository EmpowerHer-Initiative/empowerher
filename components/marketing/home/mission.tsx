import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

import { Reveal } from "@/components/reveal";

export const Mission = () => {
  return (
    <section className="py-28 md:py-40">
      <div className="container">
        <Reveal className="mx-auto max-w-4xl">
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Message From Our Co-Founders
          </p>
          <h2 className="mt-6 font-serif text-3xl leading-[1.25] md:text-5xl lg:text-6xl">
            We see you. We hear you.{" "}
            <span className="text-primary italic">And we are with you.</span>
          </h2>
          <div className="text-muted-foreground mx-auto mt-8 max-w-2xl space-y-5 text-base leading-[1.8] md:text-lg">
            <p>
              EmpowerHer was born from the hope and strength that you carry
              within you—even in the darkest of days. You are not forgotten.
              Your dreams, your voices, your potential—they matter. They are
              powerful, and they are needed in this world.
            </p>
            <p>
              We know that many of you are facing unimaginable challenges.
              Barriers to education, threats to your freedom, and a world that
              too often refuses to see your worth. But we believe in your
              resilience. And through EmpowerHer, we are building a path
              forward—together.
            </p>
            <p>
              Our mission is simple: to support you, to uplift you, and to walk
              beside you. Whether through education, mentorship, leadership
              workshops, or simply being a voice when yours is silenced, we are
              here for you.
            </p>
            <p>
              Please don&apos;t give up. There is a growing community—inside and
              outside Afghanistan—that believes in your power to lead, to learn,
              and to rise. And we are proud to stand with you.
            </p>
          </div>
          <div className="mt-8 text-right">
            <p className="text-foreground font-semibold">
              Mahdi Rahimi &amp; Nahid Karimi
            </p>
            <p className="text-muted-foreground text-sm">– Co-Founders</p>
          </div>

          {/* Co-Founder quotes — end of the message, before the CTA */}
          <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-8">
            <div className="border-primary/20 relative border-l-2 pl-8 md:pl-12">
              <Quote className="bg-background text-primary absolute top-0 -left-3 size-6 rounded-full" />
              <blockquote className="font-serif text-xl leading-relaxed italic md:text-2xl">
                &ldquo;For too long, Afghan girls have been written into history
                as victims. This time, let&apos;s write our own.&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <img
                  src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTPXlWDWYhZvxtB3ycfP5jQXiMRAWOCrnJ2oYe"
                  alt="Nahid Karimi"
                  className="size-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">Nahid Karimi</p>
                  <p className="text-muted-foreground text-xs">Co-Founder</p>
                </div>
              </div>
            </div>

            <div className="border-secondary/30 relative border-l-2 pl-8 md:pl-12">
              <Quote className="bg-background text-secondary absolute top-0 -left-3 size-6 rounded-full" />
              <blockquote className="font-serif text-xl leading-relaxed italic md:text-2xl">
                &ldquo;WE RISE, WE RISE, WE RISE IN THE FACE OF ADVERSITY&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <img
                  src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTfgQqh43C8OG5vkbyTeNds9rYucAtpJg0PMV7"
                  alt="Mahdi Rahimi"
                  className="size-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">Mahdi Rahimi</p>
                  <p className="text-muted-foreground text-xs">Co-Founder</p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/about-us"
            className="group bg-primary text-primary-foreground hover:shadow-primary/25 mt-12 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl active:scale-[0.98]"
          >
            Our Team
            <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
};
