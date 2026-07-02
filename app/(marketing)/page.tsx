"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Heart,
  Play,
  Quote,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useTRPC } from "@/services/trpc/client";

import { Reveal } from "@/components/reveal";

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
        <div className="max-w-5xl">
          <h1 className="font-serif text-4xl leading-[1.08] text-white md:text-6xl lg:text-8xl">
            Empowering Dreams,
            <br />
            <span className="text-[var(--primary)] italic">
              Inspiring Futures
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            At EmpowerHer, we believe every Afghan girl and woman has a story
            worth telling and a future worth fighting for. Through mentorship
            programs and publication opportunities, we help them find the tools,
            confidence, and platforms they need to raise their voices and become
            changemakers in their communities and beyond.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/about-us"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/90 active:scale-[0.98]"
            >
              About Us
              <span className="flex size-7 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                <ArrowRight className="size-3.5" />
              </span>
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

/* ─── CountUp — scroll-triggered number animation ──────────────────────────── */

const CountUp = ({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 2000,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        let startTs: number | null = null;
        const tick = (ts: number) => {
          if (startTs === null) startTs = ts;
          const p = Math.min((ts - startTs) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(to * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
};

/* ─── Marquee Stats Bar — Horizontal scroll strip ──────────────────────────── */

const StatsBar = () => (
  <section className="border-border/40 bg-primary/[0.03] border-y py-20 md:py-28">
    <div className="container">
      <Reveal asChild>
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl leading-tight md:text-5xl">
            Abandoned Futures: Let Afghan Girls Learn
          </h2>
          <p className="text-muted-foreground mt-6 max-w-md text-base leading-relaxed md:text-lg">
            Since September 2021, all Afghan girls over the age of 12 have been
            banned from attending school.
          </p>
          <a
            href="https://www.unesco.org/en/articles/let-girls-and-women-afghanistan-learn"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-primary text-primary-foreground hover:shadow-primary/25 mt-8 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl active:scale-[0.98]"
          >
            More Details
            <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
          </a>
        </div>
      </Reveal>

      <div className="divide-border/40 mt-14 grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
        {[
          {
            to: 1.1,
            decimals: 1,
            suffix: " million",
            label: "Girls have lost access to formal education.",
          },
          {
            to: 2.5,
            decimals: 1,
            suffix: " million",
            label:
              "School-aged Afghan girls (80%) are currently out of school.",
          },
          {
            to: 30,
            decimals: 0,
            suffix: "%",
            label:
              "Nearly 30% of Afghan girls have never attended primary school.",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-2 px-2 py-8 md:px-8 md:py-2"
          >
            <span className="text-primary font-serif text-4xl md:text-5xl">
              <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
            </span>
            <span className="text-muted-foreground max-w-xs text-sm leading-snug">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── At a Glance — Impact numbers ─────────────────────────────────────────── */

const AtAGlance = () => (
  <section className="border-border/40 bg-primary/[0.03] border-y py-20 md:py-28">
    <div className="container">
      <Reveal asChild>
        <div className="max-w-2xl">
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            By the Numbers
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight md:text-5xl">
            EmpowerHer at a Glance
          </h2>
        </div>
      </Reveal>

      <div className="divide-border/40 mt-14 grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x lg:grid-cols-5 lg:divide-y-0">
        {[
          {
            to: 500,
            suffix: "+",
            label: "Students Mentored",
          },
          {
            to: 9,
            suffix: "+",
            label: "Countries Reached",
            detail:
              "Afghanistan, Tajikistan, Kazakhstan, Pakistan, Iran, Turkey, India, Bangladesh, Malaysia",
          },
          {
            to: 8,
            suffix: "+",
            label: "Countries in Our Global Team",
            detail:
              "Afghanistan, Poland, Peru, United States, China, Pakistan, Iran, Bangladesh",
          },
          {
            to: 25,
            suffix: "+",
            label: "Provinces of Afghanistan Reached",
          },
          {
            to: 50,
            suffix: "+",
            label: "Student Publications",
            detail: "Published through HerVoice",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-2 px-2 py-8 sm:px-8 sm:py-2"
          >
            <span className="text-primary font-serif text-4xl md:text-5xl">
              <CountUp to={s.to} decimals={0} suffix={s.suffix} />
            </span>
            <span className="text-foreground text-sm font-medium">
              {s.label}
            </span>
            {s.detail && (
              <span className="text-muted-foreground text-xs leading-relaxed">
                {s.detail}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Mission Statement — Editorial typography ─────────────────────────────── */

const Mission = () => {
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

/* ─── Programs — Asymmetric Bento Grid ─────────────────────────────────────── */

const Programs = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <Reveal asChild>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
              What We Do
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl">
              Our Programs
            </h2>
          </div>
          <Link
            href="/mentorship"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          >
            View all programs <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </Reveal>

      <Reveal asChild delay={80}>
        <p className="text-muted-foreground mt-8 max-w-3xl text-base leading-[1.8]">
          Our projects are designed to meet Afghan girls where they are—and help
          them grow into who they&rsquo;re meant to be. Each initiative provides
          a safe, inclusive space where participants gain the tools, guidance,
          and community they need to rise. From leadership workshops to
          storytelling programs, every project builds confidence, sharpens
          skills, and encourages bold self-expression. Together, we&rsquo;re
          creating spaces where Afghan girls can learn, lead, and shape their
          own futures.
        </p>
      </Reveal>

      <Reveal asChild delay={160}>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {/* HerVoice — large card */}
          <Link href="/hervoice" className="group">
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

          {/* Mentorship */}
          <Link href="/mentorship" className="group">
            <div className="relative aspect-[4/3] min-h-[360px] overflow-hidden rounded-[2rem] md:aspect-auto md:h-full">
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
                  EmpowerHer&apos;s core program offers Afghan girls free
                  workshops and mentorship to build resilience, gain support,
                  and launch impact projects.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-all duration-500 group-hover:gap-2.5">
                  Explore <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ─── HerVoice Contest — Winners showcase band ─────────────────────────────── */

const CONTEST_WINNERS = [
  {
    rank: "1st",
    prize: "$400",
    name: "Z.H.",
    title: "Bread and a Red Apple",
    quote:
      "I have turned the basement of my house into a school, a secret school for girls, to teach them everything that is forbidden.",
    slug: "bread-and-a-red-apple",
    cover:
      "bg-[radial-gradient(120%_90%_at_28%_8%,#F0C963_0%,transparent_55%),linear-gradient(160deg,#C9942C_0%,#9A6A18_60%,#7A5212_100%)] text-[#FBF3DD]",
    ribbon: "bg-gradient-to-b from-[#E0AE3C] to-[#C8902A]",
    offset: "lg:-ml-6",
  },
  {
    rank: "2nd",
    prize: "$300",
    name: "Roqia Qasemi",
    title: "When Did I Feel That I Am a Strong Girl?",
    quote:
      "You close the door, I will reach my dreams through the window. You beat me, I will use my blood as ink for my pen.",
    slug: "when-did-i-feel-that-i-am-a-strong-girl",
    cover:
      "bg-[radial-gradient(120%_90%_at_28%_8%,#5FB6F0_0%,transparent_55%),linear-gradient(160deg,#2C72B6_0%,#194B7E_62%,#123A63_100%)] text-[#EAF3FB]",
    ribbon: "bg-gradient-to-b from-[#2E9BE6] to-[#1E78C4]",
    offset: "lg:ml-1.5",
  },
  {
    rank: "3rd",
    prize: "$200",
    name: "Nazifa Popal",
    title: "What I Carried in My Voice",
    quote:
      "Every limitation had been, in its own crooked and unasked-for way, a preparation. And I had used all of it.",
    slug: "what-i-carried-in-my-voice",
    cover:
      "bg-[radial-gradient(120%_90%_at_28%_8%,#5C7793_0%,transparent_55%),linear-gradient(160deg,#33445C_0%,#212E42_60%,#18222F_100%)] text-[#E7ECF3]",
    ribbon: "bg-gradient-to-b from-[#46586F] to-[#33445C]",
    offset: "lg:ml-9",
  },
];

const StoryCover = ({
  title,
  author,
  cover,
}: {
  title: string;
  author: string;
  cover: string;
}) => (
  <div
    className={`relative h-[140px] w-[104px] flex-none overflow-hidden rounded-[5px] shadow-[0_1px_2px_rgba(10,15,25,.25),0_14px_28px_-16px_rgba(10,15,25,.55)] transition-transform duration-[450ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:-translate-y-1 group-hover:-rotate-2 ${cover}`}
  >
    <div className="absolute inset-[7px] flex flex-col items-center justify-center gap-[7px] rounded-[2px] border border-white/30 px-2 py-2 text-center">
      <span className="text-[6.5px] font-bold tracking-[0.22em] uppercase opacity-70">
        HerVoice &middot; 2026
      </span>
      <span className="font-serif text-xs leading-[1.05] font-medium italic">
        {title}
      </span>
      <span className="h-px w-[18px] bg-current opacity-50" />
      <span className="text-[6.5px] font-semibold tracking-[0.16em] uppercase opacity-60">
        {author}
      </span>
    </div>
    <span className="absolute top-0 bottom-0 left-0 w-[5px] bg-black/20 shadow-[inset_-1px_0_0_rgba(255,255,255,.12)]" />
  </div>
);

const ContestSeal = () => (
  <div className="relative size-32">
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className="h-full w-full animate-[spin_26s_linear_infinite]"
    >
      <defs>
        <path
          id="hv-seal-path"
          d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
        />
      </defs>
      <circle
        cx="60"
        cy="60"
        r="56"
        fill="none"
        stroke="#E0AE3C"
        strokeWidth="1.4"
      />
      <circle
        cx="60"
        cy="60"
        r="44"
        fill="none"
        stroke="#E0AE3C"
        strokeWidth="1"
        strokeDasharray="1.5 4.5"
        opacity="0.8"
      />
      <text
        fill="#E0AE3C"
        style={{ fontSize: "9.2px", fontWeight: 700, letterSpacing: "3px" }}
      >
        <textPath href="#hv-seal-path" startOffset="0">
          HERVOICE &middot; CELEBRATING WINNERS &middot;{" "}
        </textPath>
      </text>
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      <p className="font-serif text-[26px] leading-none font-bold">2026</p>
      <p className="mt-0.5 text-[8.5px] font-bold tracking-[0.2em] text-[#E0AE3C] uppercase">
        Winners
      </p>
    </div>
  </div>
);

const HerVoiceContest = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(120%_130%_at_12%_0%,#FFFFFF_0%,#FAF6EE_46%,#F2EADC_100%)] py-28 text-[#1A2230] md:py-40">
      {/* ambient color blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 size-[520px] rounded-full bg-[radial-gradient(circle_at_38%_36%,rgba(46,155,230,.16),transparent_62%)]" />
      <div className="pointer-events-none absolute -bottom-44 -left-32 size-[460px] rounded-full bg-[radial-gradient(circle_at_60%_40%,rgba(224,174,60,.18),transparent_62%)]" />

      <div className="relative container">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.12fr] lg:items-center lg:gap-10">
          {/* Left — headline, seal, stats, CTA */}
          <div>
            <Reveal asChild>
              <p className="text-secondary text-xs font-semibold tracking-[0.3em] uppercase">
                EmpowerHer Presents
              </p>
            </Reveal>
            <Reveal asChild delay={90}>
              <h2 className="mt-5 font-serif text-4xl leading-[1.02] md:text-6xl">
                HerVoice <span className="text-primary">2026</span>
                <br />
                Writing Contest
              </h2>
            </Reveal>
            <Reveal asChild delay={180}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[#3C4654] md:text-lg">
                Courage, identity, and storytelling — by Afghan girls and women,
                written from within Afghanistan.
              </p>
            </Reveal>

            <Reveal asChild delay={270}>
              <div className="mt-8">
                <ContestSeal />
              </div>
            </Reveal>

            <Reveal asChild delay={360}>
              <div className="mt-8 flex gap-8 md:gap-10">
                {[
                  { n: "300+", label: "Submissions", cls: "text-primary" },
                  { n: "3", label: "Honorees", cls: "text-secondary" },
                  { n: "5", label: "Cash Winners", cls: "text-primary" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className={`font-serif text-4xl md:text-5xl ${s.cls}`}>
                      {s.n}
                    </p>
                    <p className="mt-1.5 text-[11px] font-semibold tracking-[0.12em] text-[#6B7686] uppercase">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal asChild delay={450}>
              <div className="mt-10">
                <Link
                  href="/hervoice/winners"
                  className="group bg-primary text-primary-foreground inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
                >
                  Explore Winning Stories
                  <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right — staggered winner cards */}
          <div className="flex flex-col gap-4">
            {CONTEST_WINNERS.map((w, i) => (
              <Reveal asChild key={w.slug} delay={270 + i * 90}>
                <Link
                  href={`/hervoice/${w.slug}`}
                  className={`group bg-background text-foreground grid grid-cols-[104px_1fr] items-center gap-5 rounded-2xl p-[18px] shadow-[0_18px_44px_-30px_rgba(0,0,0,.5)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-x-1.5 hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-32px_rgba(0,0,0,.6)] ${w.offset}`}
                >
                  <StoryCover title={w.title} author={w.name} cover={w.cover} />
                  <div className="min-w-0">
                    <div className="flex items-baseline justify-between gap-2.5">
                      <span className="truncate text-lg font-bold">
                        {w.name}
                      </span>
                      <span className="flex items-center gap-2">
                        <span
                          className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-bold tracking-[0.1em] text-white uppercase ${w.ribbon}`}
                        >
                          {w.rank}
                        </span>
                        <span className="font-serif text-lg font-bold text-[#C8902A]">
                          {w.prize}
                        </span>
                      </span>
                    </div>
                    <p className="text-primary mt-0.5 truncate font-serif text-base italic">
                      {w.title}
                    </p>
                    <p className="text-muted-foreground mt-2 line-clamp-3 text-[13px] leading-snug">
                      &ldquo;{w.quote}&rdquo;
                    </p>
                    <span className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-bold whitespace-nowrap text-[#C8902A] transition-all duration-500 group-hover:gap-2.5">
                      Read Preview
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Impact Story — Editorial image + text ────────────────────────────────── */

const ImpactStory = () => (
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

/* ─── Media Spotlight — Video carousel ─────────────────────────────────────── */

const mediaFeatures = [
  {
    youtubeId: "l5YSKsYqbfY",
    label: "Podcast",
    title: "Interview with EmpowerHer Co-Founders",
    description:
      "Our co-founders, Nahid Karimi and Mahdi Rahimi, joined the NSHSS Scholars Connect Podcast to share their personal journeys from Afghanistan to the United States and the experiences that inspired them to launch EmpowerHer. In this episode, they discuss the challenges facing Afghan girls under Taliban rule, the role of education and mentorship in creating opportunity, and how young people can transform adversity into meaningful impact and leadership.",
  },
];

const MediaSpotlight = () => {
  const [idx, setIdx] = useState(0);
  const total = mediaFeatures.length;
  const next = () => setIdx((i) => (i + 1) % total);
  const prev = () => setIdx((i) => (i - 1 + total) % total);

  return (
    <section className="py-28 md:py-40">
      <div className="container">
        <Reveal asChild>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
                Watch &amp; Listen
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">
                Featured Media
              </h2>
            </div>
            {total > 1 && (
              <div className="hidden items-center gap-3 md:flex">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous"
                  className="border-border/60 text-foreground/70 hover:border-primary hover:text-foreground flex size-12 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-95"
                >
                  <ArrowLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next"
                  className="border-border/60 text-foreground/70 hover:border-primary hover:text-foreground flex size-12 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-95"
                >
                  <ArrowRight className="size-5" />
                </button>
              </div>
            )}
          </div>
        </Reveal>

        {/* Carousel viewport */}
        <Reveal asChild delay={120}>
          <div className="relative mt-12 overflow-hidden rounded-[2.5rem]">
            <div
              className="flex transition-transform duration-[800ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{ transform: `translateX(-${idx * 100}%)` }}
            >
              {mediaFeatures.map((m) => (
                <div key={m.youtubeId} className="w-full shrink-0">
                  <div className="bg-muted/30 grid gap-0 lg:grid-cols-2">
                    <div className="relative aspect-video lg:aspect-auto lg:min-h-[440px]">
                      <iframe
                        src={`https://www.youtube.com/embed/${m.youtubeId}`}
                        title={m.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-8 md:p-14">
                      <div className="text-primary flex items-center gap-2">
                        <Play className="size-4 fill-current" />
                        <span className="text-xs font-medium tracking-[0.2em] uppercase">
                          {m.label}
                        </span>
                      </div>
                      <h3 className="mt-4 font-serif text-2xl leading-tight md:text-3xl">
                        {m.title}
                      </h3>
                      <p className="text-muted-foreground mt-5 text-base leading-[1.8]">
                        {m.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Click the right side to advance */}
            {total > 1 && (
              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="group absolute inset-y-0 right-0 flex w-16 items-center justify-center md:w-24"
              >
                <span className="bg-background/80 text-foreground flex size-12 items-center justify-center rounded-full shadow-lg backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:scale-110">
                  <ArrowRight className="size-5" />
                </span>
              </button>
            )}
          </div>
        </Reveal>

        {/* Dots */}
        {total > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {mediaFeatures.map((m, i) => (
              <button
                key={m.youtubeId}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === idx ? "bg-primary w-8" : "bg-border w-2.5"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ─── Partners — Minimal logo strip ────────────────────────────────────────── */

const partners = [
  {
    name: "NSHSS",
    logo: "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTjPNmNesfkIRBuYnTVcl8O9LdXP5103pNyJUt",
    href: "https://www.nshss.org/",
  },
  {
    name: "Right to Learn Afghanistan",
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
  {
    name: "Inanna",
    logo: "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTTIznPr82WufQtTg5yH7OAp0KFlsjbkaYIPZB",
    href: "https://inanna.ca/",
  },
  {
    name: "Human Media",
    logo: "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT2HJysqLQtJ7K2Z4UcWn3gCXRdBvVoY9Ohil8",
    href: "https://humanitasmedia.org/",
  },
];

const Partners = () => (
  <section className="py-28 md:py-32">
    <div className="container">
      <Reveal asChild>
        <p className="text-muted-foreground text-center text-xs font-semibold tracking-[0.3em] uppercase">
          Trusted Partners & Supporters
        </p>
      </Reveal>
      <Reveal asChild delay={80}>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {partners.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              title={p.name}
              className="group block transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:scale-105"
            >
              <img
                src={p.logo}
                alt={p.name}
                className="h-16 w-auto object-contain md:h-24"
              />
            </a>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

/* ─── Newsletter — Rich CTA section ────────────────────────────────────────── */

const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

const Newsletter = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const trpc = useTRPC();
  const subscribe = useMutation(trpc.newsletter.subscribe.mutationOptions());

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      const result = await subscribe.mutateAsync({ email: data.email });

      if (result.alreadySubscribed) {
        form.setError("email", {
          message: "You are already subscribed to the newsletter",
        });
        return;
      }

      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      form.setError("email", {
        message:
          error instanceof Error
            ? error.message
            : "Failed to subscribe to newsletter",
      });
    }
  };

  return (
    <section className="bg-muted text-foreground relative overflow-hidden py-28 md:py-40">
      {/* Decorative elements */}
      <div className="bg-primary/[0.08] pointer-events-none absolute -top-32 -left-32 size-96 rounded-full blur-3xl" />
      <div className="bg-secondary/[0.08] pointer-events-none absolute -right-24 -bottom-24 size-80 rounded-full blur-3xl" />
      <div className="border-foreground/[0.04] pointer-events-none absolute top-1/2 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border" />
      <div className="border-foreground/[0.04] pointer-events-none absolute top-1/2 left-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border" />

      <div className="relative container">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left — messaging */}
          <Reveal asChild>
            <div>
              <div className="border-border bg-card inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
                <Heart className="text-primary size-3.5" />
                <span className="text-muted-foreground text-[10px] font-semibold tracking-[0.2em] uppercase">
                  Stay Connected
                </span>
              </div>
              <h2 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
                Join Our
                <br />
                <span className="text-primary italic">Community</span>
              </h2>
              <p className="text-muted-foreground mt-6 max-w-md text-base leading-[1.8]">
                Get updates on our programs, success stories, and ways to
                support Afghan girls&apos; education. Be part of a growing
                movement for change.
              </p>

              {/* <div className="mt-10 flex items-center gap-8">
            <div>
              <p className="text-primary font-serif text-3xl">9+</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Global Partners
              </p>
            </div>
            <div className="bg-border h-10 w-px" />
            <div>
              <p className="text-primary font-serif text-3xl">5</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Active Workshops
              </p>
            </div>
            <div className="bg-border h-10 w-px" />
            <div>
              <p className="text-primary font-serif text-3xl">100%</p>
              <p className="text-muted-foreground mt-1 text-xs">Free Programs</p>
            </div>
          </div> */}
            </div>
          </Reveal>

          {/* Right — form card */}
          <Reveal asChild delay={120}>
            <div className="border-border bg-card rounded-3xl border p-8 shadow-sm md:p-10">
              <h3 className="font-serif text-2xl">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                Join hundreds of supporters and community members.
              </p>
              {isSubmitted ? (
                <div className="border-primary/20 bg-primary/[0.06] mt-8 rounded-xl border px-5 py-6 text-center">
                  <p className="text-foreground text-sm font-semibold">
                    Thanks for subscribing!
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    You&apos;re now part of our community.
                  </p>
                </div>
              ) : (
                <form
                  className="mt-8 space-y-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                  noValidate
                >
                  <div>
                    <input
                      type="email"
                      placeholder="Your email address"
                      disabled={form.formState.isSubmitting}
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/40 w-full rounded-xl border px-5 py-3.5 text-sm transition-all duration-300 outline-none disabled:opacity-60"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-destructive mt-2 text-xs">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:opacity-60"
                  >
                    {form.formState.isSubmitting ? "Subscribing…" : "Subscribe"}
                  </button>
                </form>
              )}
              <p className="text-muted-foreground mt-4 text-center text-xs">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <HerVoiceContest />
      <AtAGlance />
      <Mission />
      <Programs />
      <ImpactStory />
      <MediaSpotlight />
      <Partners />
      <Newsletter />
    </>
  );
}
