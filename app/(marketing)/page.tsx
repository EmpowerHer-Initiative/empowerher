"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Heart,
  Quote,
  Users,
} from "lucide-react";

/* ─── Cinematic Hero — Full-width editorial split ──────────────────────────── */

const Hero = () => {
  const images = [
    "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTN5bpAvcOGaUAyKX1dPWs9RnojYZeu4JbiQHv",
    "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTvX8bHR050TX8DRt9gfxu6sU74iOHozSwBKGJ",
    "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTfCWhJzn3C8OG5vkbyTeNds9rYucAtpJg0PMV",
    "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTQRqW7Y9a2imSKVTAuXrJU9NxI0LRsOFlgdvw",
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      {/* Full-bleed background image */}
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1.8s] ease-[cubic-bezier(0.32,0.72,0,1)] ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />

      {/* Content overlay */}
      <div className="relative container flex min-h-[100dvh] items-end pt-40 pb-20 md:items-center md:pb-0">
        <div className="max-w-2xl">
          <p className="font-serif text-sm tracking-[0.3em] text-white/60 uppercase md:text-base">
            Empowering Afghan Girls Since 2024
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-white md:text-7xl lg:text-8xl">
            Empowering
            <br />
            <span className="text-[var(--primary)] italic">Dreams</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
            Every Afghan girl has a story worth telling and a future worth
            fighting for. We give them the tools, confidence, and platforms to
            rise.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/about-us"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/90 active:scale-[0.98]"
            >
              Our Story
              <span className="flex size-7 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
            <Link
              href="/get-involved"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-medium text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/60 hover:bg-white/5"
            >
              Get Involved
            </Link>
          </div>

          {/* Dots */}
          <div className="mt-12 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-[3px] rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  i === idx ? "w-10 bg-white" : "w-4 bg-white/30"
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Marquee Stats Bar — Horizontal scroll strip ──────────────────────────── */

const StatsBar = () => (
  <section className="border-border/40 bg-primary/[0.03] border-y">
    <div className="divide-border/40 container grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
      {[
        { value: "1.1M+", label: "girls lost access to education" },
        { value: "2.5M", label: "Afghan girls currently out of school" },
        { value: "30%", label: "never attended primary school" },
      ].map((s) => (
        <div
          key={s.value}
          className="flex items-center gap-6 px-2 py-10 md:justify-center md:px-8"
        >
          <span className="text-primary font-serif text-4xl md:text-5xl">
            {s.value}
          </span>
          <span className="text-muted-foreground max-w-[10rem] text-sm leading-snug">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  </section>
);

/* ─── Mission Statement — Editorial typography ─────────────────────────────── */

const Mission = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVis(true),
      { threshold: 0.15 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-28 md:py-40">
      <div className="container">
        <div
          className="mx-auto max-w-4xl transition-all duration-[1.2s] ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(3rem)",
          }}
        >
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Our Belief
          </p>
          <h2 className="mt-6 font-serif text-3xl leading-[1.25] md:text-5xl lg:text-6xl">
            We see you. We hear you.{" "}
            <span className="text-primary italic">And we are with you.</span>
          </h2>
          <p className="text-muted-foreground mt-8 max-w-2xl text-base leading-[1.8] md:text-lg">
            EmpowerHer was born from the hope and strength that you carry within
            you — even in the darkest of days. Through education, mentorship,
            and creative expression, we are building a path forward — together.
          </p>
        </div>
      </div>
    </section>
  );
};

/* ─── Programs — Asymmetric Bento Grid ─────────────────────────────────────── */

const Programs = () => (
  <section className="bg-foreground text-background py-28 md:py-40">
    <div className="container">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-background/50 text-xs font-semibold tracking-[0.3em] uppercase">
            What We Do
          </p>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl">Our Programs</h2>
        </div>
        <Link
          href="/mentorship"
          className="text-background/60 hover:text-background inline-flex items-center gap-2 text-sm transition-colors"
        >
          View all programs <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-5">
        {/* HerVoice — large card */}
        <Link href="/hervoice" className="group md:col-span-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] md:aspect-auto md:h-full">
            <img
              src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTEK40ctbfRbjSv9fDHMpJXBriOWVtPmoQZNC3"
              alt="HerVoice"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 p-8">
              <div className="flex items-center gap-2 text-white/60">
                <BookOpen className="size-4" />
                <span className="text-xs font-medium tracking-[0.2em] uppercase">
                  Storytelling Platform
                </span>
              </div>
              <h3 className="mt-2 font-serif text-3xl text-white md:text-4xl">
                HerVoice
              </h3>
              <p className="mt-2 max-w-md text-sm text-white/70">
                A platform for Afghan girls to share their stories, amplify
                their voices, and inspire change through creative expression.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-all duration-500 group-hover:gap-2.5">
                Explore <ArrowUpRight className="size-3.5" />
              </span>
            </div>
          </div>
        </Link>

        {/* Right column — stacked */}
        <div className="flex flex-col gap-6 md:col-span-2">
          {/* Mentorship */}
          <Link href="/mentorship" className="group flex-1">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-[2rem]">
              <img
                src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTztHu6kOQlbZOApif7EkNI4MXGo08zhqH6CwY"
                alt="Mentorship"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-6">
                <div className="flex items-center gap-2 text-white/60">
                  <Users className="size-4" />
                  <span className="text-xs font-medium tracking-[0.2em] uppercase">
                    Core Program
                  </span>
                </div>
                <h3 className="mt-2 font-serif text-2xl text-white">
                  Mentorship
                </h3>
                <p className="mt-1 text-sm text-white/70">
                  Free workshops and mentorship to build resilience and launch
                  impact projects.
                </p>
              </div>
            </div>
          </Link>

          {/* Get Involved CTA */}
          <Link
            href="/get-involved"
            className="group bg-primary hover:bg-primary/90 flex items-center justify-between rounded-[2rem] p-8 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          >
            <div>
              <p className="text-primary-foreground/60 text-xs font-medium tracking-[0.2em] uppercase">
                Make a Difference
              </p>
              <p className="text-primary-foreground mt-1 font-serif text-xl">
                Get Involved
              </p>
            </div>
            <span className="bg-primary-foreground/15 flex size-12 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-0.5">
              <ArrowUpRight className="text-primary-foreground size-5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Co-Founder Quotes — Full-width editorial ─────────────────────────────── */

const Quotes = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="grid gap-12 md:grid-cols-2 md:gap-8">
        <div className="border-primary/20 relative border-l-2 pl-8 md:pl-12">
          <Quote className="bg-background text-primary absolute top-0 -left-3 size-6 rounded-full" />
          <blockquote className="font-serif text-xl leading-relaxed italic md:text-2xl">
            &ldquo;For too long, Afghan girls have been written into history as
            victims. This time, let&apos;s write our own.&rdquo;
          </blockquote>
          <div className="mt-6 flex items-center gap-4">
            <img
              src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTqvGdhshBYobifLHTavDVU7h0yBGlSc4z8XEQ"
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
              src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTiCpeojEYyVpqbIDknS5OTfuHm1N4G0ctWRE9"
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
    </div>
  </section>
);

/* ─── Impact Story — Editorial image + text ────────────────────────────────── */

const ImpactStory = () => (
  <section className="bg-muted/30 py-28 md:py-40">
    <div className="container">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="order-2 lg:order-1">
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Media Coverage
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">
            EmpowerHer in the News
          </h2>
          <p className="text-muted-foreground mt-6 text-base leading-[1.8]">
            Our mission to empower Afghan girls has been recognized by local
            media. EmpowerHer was featured in a Virginia newsletter through our
            partnership with Rappahannock News, amplifying narratives of
            resilience and leadership.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/hervoice/featured-writings-from-our-partners"
              className="group bg-primary text-primary-foreground hover:shadow-primary/20 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg active:scale-[0.98]"
            >
              Read Featured Writings
              <ArrowRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/success-stories"
              className="border-border/60 text-foreground/70 hover:border-primary/30 hover:text-foreground inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              Success Stories
            </Link>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="relative overflow-hidden rounded-[2.5rem]">
            <img
              src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTnBGUBwPQgRrhjkv2mNoAG6Y5KExwBW7Cqs1O"
              alt="EmpowerHer in the news"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Partners — Minimal logo strip ────────────────────────────────────────── */

const partners = [
  {
    name: "NSHSS",
    logo: "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTjPNmNesfkIRBuYnTVcl8O9LdXP5103pNyJUt",
    href: "https://www.nshss.org/",
  },
  {
    name: "Right to Learn",
    logo: "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTBRQC7aZcQ1oEZ9sIXj8tePOrDbdN2iaU7v5q",
    href: "https://righttolearn.ca/",
  },
  {
    name: "AGFAF",
    logo: "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTpavV7aqrM0zsm5gThJ2eDxZtjCFUdBGElvb1",
    href: "https://agfaf.org/",
  },
  {
    name: "Amplify Afghan Women",
    logo: "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTnBzmSPQgRrhjkv2mNoAG6Y5KExwBW7Cqs1O9",
    href: "https://sites.google.com/view/amplifyafghans/home",
  },
  {
    name: "Sahar Education",
    logo: "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT0La8F8o1jbZo7DsLPidlGr6Uf2HKquxXJ3CN",
    href: "https://www.sahareducation.org/",
  },
  {
    name: "Girls Opportunity Alliance",
    logo: "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTTVVN0CQ82WufQtTg5yH7OAp0KFlsjbkaYIPZ",
    href: "https://www.obama.org/programs/girls-opportunity-alliance/",
  },
  {
    name: "Mente Global",
    logo: "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTUekbWeMuHB63DFcWbZp7rAk9VUJPgitsO2Ca",
    href: "https://menteeglobal.org/",
  },
];

const Partners = () => (
  <section className="py-28 md:py-32">
    <div className="container">
      <p className="text-muted-foreground text-center text-xs font-semibold tracking-[0.3em] uppercase">
        Trusted Partners & Supporters
      </p>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-10 md:gap-16">
        {partners.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            title={p.name}
            className="opacity-50 grayscale transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-100 hover:grayscale-0"
          >
            <img
              src={p.logo}
              alt={p.name}
              className="h-16 w-auto object-contain md:h-24"
            />
          </a>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Newsletter — Rich CTA section ────────────────────────────────────────── */

const Newsletter = () => (
  <section className="bg-foreground text-background relative overflow-hidden py-28 md:py-40">
    {/* Decorative elements */}
    <div className="bg-primary/[0.07] pointer-events-none absolute -top-32 -left-32 size-96 rounded-full blur-3xl" />
    <div className="bg-secondary/[0.05] pointer-events-none absolute -right-24 -bottom-24 size-80 rounded-full blur-3xl" />
    <div className="border-background/[0.03] pointer-events-none absolute top-1/2 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border" />
    <div className="border-background/[0.05] pointer-events-none absolute top-1/2 left-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border" />

    <div className="relative container">
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left — messaging */}
        <div>
          <div className="border-background/10 bg-background/5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
            <Heart className="text-primary size-3.5" />
            <span className="text-background/60 text-[10px] font-semibold tracking-[0.2em] uppercase">
              Stay Connected
            </span>
          </div>
          <h2 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
            Join Our
            <br />
            <span className="text-primary italic">Community</span>
          </h2>
          <p className="text-background/50 mt-6 max-w-md text-base leading-[1.8]">
            Get updates on our programs, success stories, and ways to support
            Afghan girls&apos; education. Be part of a growing movement for
            change.
          </p>

          <div className="mt-10 flex items-center gap-8">
            <div>
              <p className="text-primary font-serif text-3xl">7+</p>
              <p className="text-background/40 mt-1 text-xs">Global Partners</p>
            </div>
            <div className="bg-background/10 h-10 w-px" />
            <div>
              <p className="text-primary font-serif text-3xl">5</p>
              <p className="text-background/40 mt-1 text-xs">
                Active Workshops
              </p>
            </div>
            <div className="bg-background/10 h-10 w-px" />
            <div>
              <p className="text-primary font-serif text-3xl">100%</p>
              <p className="text-background/40 mt-1 text-xs">Free Programs</p>
            </div>
          </div>
        </div>

        {/* Right — form card */}
        <div className="border-background/10 bg-background/[0.04] rounded-3xl border p-8 backdrop-blur-sm md:p-10">
          <h3 className="font-serif text-2xl">Subscribe to Our Newsletter</h3>
          <p className="text-background/50 mt-3 text-sm leading-relaxed">
            Join hundreds of supporters. We send monthly updates — no spam,
            ever.
          </p>
          <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="border-background/10 bg-background/5 text-background placeholder:text-background/30 focus:border-primary/40 focus:bg-background/10 w-full rounded-xl border px-5 py-3.5 text-sm transition-all duration-300 outline-none"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
            >
              Subscribe
            </button>
          </form>
          <p className="text-background/30 mt-4 text-center text-xs">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <Mission />
      <Programs />
      <Quotes />
      <ImpactStory />
      <Partners />
      <Newsletter />
    </>
  );
}
