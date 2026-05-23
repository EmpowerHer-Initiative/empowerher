import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.pages.afgaf.title} — ${siteConfig.name}`,
  description: siteConfig.pages.afgaf.description,
};

/* ─── Intro ──────────────────────────────────────────────────────────────────── */

const Intro = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="max-w-4xl">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
          Our Primary Partner &amp; Sponsor
        </p>
        <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
          Afghan Girls Financial Assistance Fund
        </h1>
        <p className="text-muted-foreground mt-4 text-lg font-medium">AGFAF</p>
      </div>
    </div>
  </section>
);

/* ─── Spotlight ──────────────────────────────────────────────────────────────── */

const Spotlight = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-4xl">
        {/* Centered logo */}
        <div className="flex justify-center">
          <div className="border-border/40 bg-muted/20 flex w-72 items-center justify-center rounded-3xl border px-10 py-12">
            <img
              src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTpavV7aqrM0zsm5gThJ2eDxZtjCFUdBGElvb1"
              alt="AGFAF — Afghan Girls Financial Assistance Fund"
              className="w-full object-contain"
            />
          </div>
        </div>

        {/* Description prose */}
        <div className="mt-20 grid gap-10 md:grid-cols-2">
          <div className="text-muted-foreground space-y-5 text-base leading-relaxed">
            <p>
              The Afghan Girls Financial Assistance Fund (AGFAF) is a U.S.-based
              nonprofit organization dedicated to empowering young Afghan women
              through education. Founded in response to the systemic barriers
              Afghan girls face in accessing quality education, AGFAF works to
              identify, support, and sponsor talented students who demonstrate
              academic promise and leadership potential.
            </p>
            <p>
              AGFAF partners with high schools, colleges, and universities
              across the United States to provide full financial aid, housing,
              and mentorship for Afghan girls who have limited or no access to
              education in their home country.
            </p>
          </div>
          <div className="text-muted-foreground space-y-5 text-base leading-relaxed">
            <p>
              In addition to academic support, AGFAF also offers guidance in
              college and career planning, cultural adjustment, and leadership
              development — helping these students become confident, educated
              changemakers within their communities and beyond.
            </p>
            <p>
              The organization&apos;s mission is rooted in the belief that
              educating girls is one of the most powerful tools for creating
              lasting peace, gender equality, and economic growth in Afghanistan
              and the world.
            </p>
            <p>
              AGFAF continues to grow as a network of scholars, educators, host
              families, and global advocates working together to ensure that
              Afghan girls have the opportunity to learn, lead, and thrive.
            </p>
          </div>
        </div>

        {/* Divider row */}
        <div className="divide-border/30 border-border/30 mt-20 grid grid-cols-3 divide-x border-y py-10">
          {[
            { label: "U.S.-Based Nonprofit", value: "Since 2006" },
            { label: "Afghan Girls Supported", value: "Hundreds" },
            { label: "Focus", value: "Education" },
          ].map((stat) => (
            <div key={stat.label} className="px-8 first:pl-0 last:pr-0">
              <p className="font-serif text-3xl">{stat.value}</p>
              <p className="text-muted-foreground mt-2 text-xs font-semibold tracking-[0.2em] uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ─── Gratitude ──────────────────────────────────────────────────────────────── */

const Gratitude = () => (
  <section className="bg-foreground text-background py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-3xl">
        <p className="text-background/40 text-xs font-semibold tracking-[0.3em] uppercase">
          From EmpowerHer
        </p>
        <blockquote className="text-background/85 mt-10 font-serif text-2xl leading-[1.4] md:text-3xl">
          &ldquo;EmpowerHer deeply values the unwavering support of the Afghan
          Girls Financial Assistance Fund. As our primary sponsor and partner,
          AGFAF has played a pivotal role in making many of our initiatives and
          programs possible. For nearly two decades, AGFAF has illuminated the
          path toward a brighter future for countless Afghan girls. As fellow
          Afghans and an organization aligned with their mission and vision, we
          extend our heartfelt gratitude for their continued support and belief
          in our work.&rdquo;
        </blockquote>
        <div className="bg-background/20 mt-10 h-px w-16" />
        <p className="text-background/60 mt-6 text-sm font-semibold">
          EmpowerHer Team
        </p>
      </div>
    </div>
  </section>
);

/* ─── CTA ────────────────────────────────────────────────────────────────────── */

const Cta = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="max-w-3xl">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
          Learn More
        </p>
        <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
          Support the mission. Visit AGFAF.
        </h2>
        <p className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed">
          To learn more about AGFAF&apos;s work, partner with them, or support
          their mission of educating Afghan girls, visit their website directly.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="https://agfaf.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-foreground text-background inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-80 active:scale-[0.98]"
          >
            Visit AGFAF&apos;s Website
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-px group-hover:-translate-y-px" />
          </a>
          <Link
            href="/success-stories"
            className="border-border/60 text-foreground/70 hover:border-foreground/30 hover:text-foreground inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          >
            See Our Impact Together
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function AfgafPage() {
  return (
    <>
      <Intro />
      <Spotlight />
      <Gratitude />
      <Cta />
    </>
  );
}
