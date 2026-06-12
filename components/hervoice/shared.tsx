import Link from "next/link";

import "./hervoice.css";

export const RIBBON_BG = {
  g: "bg-[linear-gradient(180deg,var(--hv-gold),var(--hv-gold2))]",
  b: "bg-[linear-gradient(180deg,var(--hv-blue),var(--hv-blue2))]",
  s: "bg-[linear-gradient(180deg,#46586F,#33445C)]",
  t: "bg-[linear-gradient(180deg,#2A9D8F,#1F7A6E)]",
  p: "bg-[linear-gradient(180deg,#7C5CBF,#5E3FA0)]",
};

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StoryCover({
  palette = "blue",
  title = "",
  author = "",
  size = "md",
}: {
  palette?: string;
  title?: string;
  author?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      className={`cover cover--${palette} cover--${size} transition-transform duration-[450ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:-translate-y-1 group-hover:-rotate-2`}
    >
      <div className="cover__frame">
        <span className="cover__kicker">HERVOICE &middot; 2026</span>
        <span className="cover__title">{title}</span>
        <span className="cover__rule" />
        <span className="cover__author">{author}</span>
      </div>
      <span className="cover__spine" />
    </div>
  );
}

export function Seal() {
  return (
    <div className="relative h-32 w-32">
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
          fill="#9A6E1C"
          style={{
            fontFamily: "var(--hv-sans)",
            fontSize: "9.2px",
            fontWeight: 700,
            letterSpacing: "3px",
          }}
        >
          <textPath href="#hv-seal-path" startOffset="0">
            HERVOICE &middot; CELEBRATING WINNERS &middot;{" "}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="font-[family-name:var(--hv-display)] text-[26px] leading-none font-bold text-[var(--hv-ink)]">
          2026
        </div>
        <div className="mt-0.5 text-[8.5px] font-bold tracking-[0.2em] text-[var(--hv-gold-deep)] uppercase">
          Winners
        </div>
      </div>
    </div>
  );
}

export function HerVoiceCTA({
  title = "Explore HerVoice Initiative",
  description = "Discover student writing, voices, and stories published through the HerVoice platform.",
  linkText = "Read More",
  href = "/hervoice",
}: {
  title?: string;
  description?: string;
  linkText?: string;
  href?: string;
}) {
  return (
    <section className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-[linear-gradient(135deg,var(--hv-blue2),var(--hv-blue))] px-8 py-10 md:flex md:items-center md:justify-between md:px-12 md:py-12">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
          <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-white/70">
            {description}
          </p>
        </div>
        <Link
          href={href}
          className="group/cta mt-6 inline-flex items-center gap-2 text-[15px] font-bold whitespace-nowrap text-white underline decoration-[var(--hv-gold)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--hv-gold)] md:mt-0"
        >
          {linkText}
          <Arrow className="transition-transform group-hover/cta:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

export function Stat({
  n,
  label,
  gold,
}: {
  n: string;
  label: string;
  gold?: boolean;
}) {
  return (
    <div>
      <div
        className={`font-[family-name:var(--hv-display)] text-3xl leading-none font-bold ${
          gold ? "text-[var(--hv-gold2)]" : "text-[var(--hv-blue2)]"
        }`}
      >
        {n}
      </div>
      <div className="mt-1.5 max-w-48 text-[11px] font-semibold tracking-[0.12em] text-[var(--hv-ink3)] uppercase">
        {label}
      </div>
    </div>
  );
}
