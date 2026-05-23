import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `Featured Writings from Our Partners — ${siteConfig.name}`,
  description:
    "Read featured writings from Afghan girls published through EmpowerHer's partner platforms — NSHSS and Amplify Afghan Women.",
};

/* ─── Data ───────────────────────────────────────────────────────────────────── */

type Writing = {
  title: string;
  author: string;
  description: string;
  image: string;
  link: string;
  platform: "NSHSS" | "Amplify Afghan Women";
  platformUrl: string;
};

const writings: Writing[] = [
  {
    title: "Building Windows Where They Built Walls",
    author: "Nahid Karimi",
    description:
      "Nahid shares her journey from losing her freedom under the Taliban to co-founding EmpowerHer, turning pain into purpose and personal loss into a movement.",
    image:
      "https://www.nshss.org/media/vymjdyup/afghan-girl_2025.png?width=640&height=360&v=1dbfa899b327380&format=webp&quality=80",
    link: "https://www.nshss.org/resources/blog/blog-posts/building-windows-where-they-built-walls/",
    platform: "NSHSS",
    platformUrl: "https://www.nshss.org/",
  },
  {
    title:
      "Leading with Resilience: My Journey as an Afghan Student and Advocate",
    author: "Mahdi Rahimi",
    description:
      "Mahdi reflects on his path from Afghanistan to the United States, sharing lessons on resilience, advocacy, and the power of education.",
    image:
      "https://www.nshss.org/media/03nk1qj0/afghan-students-2025.jpg?width=640&height=360&v=1dc107735d0c7e0&format=webp&quality=80",
    link: "https://www.nshss.org/resources/blog/blog-posts/leading-with-resilience-my-journey-as-an-afghan-student-and-advocate/",
    platform: "NSHSS",
    platformUrl: "https://www.nshss.org/",
  },
  {
    title: "How Education and Art Empower Afghan Girls",
    author: "Sabira Hussaini",
    description:
      "EmpowerHer mentor Sabira reflects on how education and art empower Afghan girls through her painting and workshops.",
    image:
      "https://www.nshss.org/media/0b1hmzo4/sabira-hussani-art.png?width=640&height=360&v=1dc228d45c7d710&format=webp&quality=80",
    link: "https://www.nshss.org/resources/blog/blog-posts/the-power-of-dreams-how-education-and-art-empower-afghan-girls/",
    platform: "NSHSS",
    platformUrl: "https://www.nshss.org/",
  },
  {
    title: "Online Education and the Fight for a Future",
    author: "Haya",
    description:
      "Haya reflects on the resilience of Afghan girls pursuing education in secret, showing that online learning has become a form of resistance.",
    image:
      "https://www.nshss.org/media/wgxo3nrb/girl-next-to-window.jpg?width=640&height=360&v=1dc32f91f7e03f0&format=webp&quality=80",
    link: "https://www.nshss.org/resources/blog/blog-posts/online-education-and-the-fight-for-a-future/",
    platform: "NSHSS",
    platformUrl: "https://www.nshss.org/",
  },
  {
    title: "The Girl from Kabul: A Story of Words and Wounds",
    author: "Sadaf A",
    description:
      "The journey of Sahar, a young Afghan girl whose dreams of becoming a writer are shattered by tragedy but rebuilt through storytelling.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTCNVteXp0xR3LuJK2fkyDlQSq5OVpmHz6CThE",
    link: "https://sites.google.com/view/amplifyafghans/women-and-society/writings-from-empowerher-part-1?authuser=0",
    platform: "Amplify Afghan Women",
    platformUrl: "https://sites.google.com/view/amplifyafghans/home",
  },
  {
    title: "If the Taliban Had Never Existed",
    author: "Sakhydadi",
    description:
      "Imagining an Afghanistan free of fear, where girls can study, dream, and build futures without restriction.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTTVlV0WA82WufQtTg5yH7OAp0KFlsjbkaYIPZ",
    link: "https://sites.google.com/view/amplifyafghans/women-and-society/writings-from-empowerher-part-1?authuser=0",
    platform: "Amplify Afghan Women",
    platformUrl: "https://sites.google.com/view/amplifyafghans/home",
  },
  {
    title: "In another time, I was\u2026",
    author: "Suhaila N",
    description:
      "Transported from present-day Afghanistan into the ancient Kushan Empire, reflecting on the enduring strength of Afghan women.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTCsBIywp0xR3LuJK2fkyDlQSq5OVpmHz6CThE",
    link: "https://sites.google.com/view/amplifyafghans/women-and-society/writings-from-empowerher-part-2?authuser=0",
    platform: "Amplify Afghan Women",
    platformUrl: "https://sites.google.com/view/amplifyafghans/home",
  },
  {
    title: "A Bridge Between Two Worlds",
    author: "Zahra A",
    description:
      "Drifting between dream and reality, finding strength in resolve\u2014to write, to speak, and to build a bridge to a better future.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT56kEagAWxDjwpl6zcWuZFSE0gC1TOnBMHdPh",
    link: "https://sites.google.com/view/amplifyafghans/women-and-society/writings-from-empowerher-part-2?authuser=0",
    platform: "Amplify Afghan Women",
    platformUrl: "https://sites.google.com/view/amplifyafghans/home",
  },
  {
    title: "What if the Taliban Didn\u2019t Exist?",
    author: "Farzana A",
    description:
      "Imagining a peaceful Afghanistan where girls study freely and dreams thrive, contrasting vision with harsh reality.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT0La06tY1jbZo7DsLPidlGr6Uf2HKquxXJ3CN",
    link: "https://sites.google.com/view/amplifyafghans/women-and-society/writing-from-empowerher-3?authuser=1",
    platform: "Amplify Afghan Women",
    platformUrl: "https://sites.google.com/view/amplifyafghans/home",
  },
  {
    title: "Why does empowering women matter?",
    author: "Sohaila S",
    description:
      "Explaining that empowering women strengthens societies through education, healthcare, and leadership.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT38knrnKpPsIbjXnuoAM3O2JygVY8KzGFtD6k",
    link: "https://sites.google.com/view/amplifyafghans/women-and-society/writing-from-empowerher-3?authuser=1",
    platform: "Amplify Afghan Women",
    platformUrl: "https://sites.google.com/view/amplifyafghans/home",
  },
  {
    title: "The Girl with the Borrowed Light",
    author: "Zarghona N",
    description:
      "The story of Laila, a 16-year-old who continues learning in secret, turning her small dark room into a place of hope.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT4sck5FSxLP0HVtXjpzDWZR85f7vGSgA1FduQ",
    link: "https://sites.google.com/view/amplifyafghans/women-and-society/writing-from-empowerher-3?authuser=1",
    platform: "Amplify Afghan Women",
    platformUrl: "https://sites.google.com/view/amplifyafghans/home",
  },
  {
    title: "Alkahest",
    author: "Asma H",
    description:
      "Sharing her dream of becoming a pilot and her belief that knowledge, like alkahest, can\u2019t be destroyed.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTfRmzu73C8OG5vkbyTeNds9rYucAtpJg0PMV7",
    link: "https://sites.google.com/view/amplifyafghans/women-and-society/writing-from-empowerher-3?authuser=1",
    platform: "Amplify Afghan Women",
    platformUrl: "https://sites.google.com/view/amplifyafghans/home",
  },
];

/* ─── Writing Card ──────────────────────────────────────────────────────────── */

const WritingCard = ({ writing }: { writing: Writing }) => (
  <a
    href={writing.link}
    target="_blank"
    rel="noopener noreferrer"
    className="group border-border/20 grid gap-5 border-b py-8 last:border-0 sm:grid-cols-[160px_1fr] sm:gap-8"
  >
    <div className="relative aspect-[16/9] overflow-hidden rounded-xl sm:aspect-[4/3]">
      <img
        src={writing.image}
        alt={writing.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
      />
    </div>
    <div className="flex flex-col justify-center">
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.1em] uppercase ${
            writing.platform === "NSHSS"
              ? "bg-primary/10 text-primary"
              : "bg-secondary/20 text-secondary-foreground"
          }`}
        >
          {writing.platform}
        </span>
        <span className="text-muted-foreground text-xs">{writing.author}</span>
      </div>
      <h3 className="group-hover:text-primary mt-2 text-base leading-snug font-semibold transition-colors duration-300">
        &ldquo;{writing.title}&rdquo;
      </h3>
      <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
        {writing.description}
      </p>
      <span className="text-primary mt-3 inline-flex items-center gap-1.5 text-xs font-medium opacity-0 transition-all duration-300 group-hover:opacity-100">
        Read on {writing.platform}
        <ArrowUpRight className="size-3" />
      </span>
    </div>
  </a>
);

/* ─── Platform Section ───────────────────────────────────────────────────────── */

const PlatformSection = ({
  platform,
  platformUrl,
  description,
  writingsList,
}: {
  platform: string;
  platformUrl: string;
  description: string;
  writingsList: Writing[];
}) => (
  <div>
    <div className="mb-2 flex items-center gap-4">
      <span className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
        {platform}
      </span>
      <div className="bg-border/30 h-px flex-1" />
      <a
        href={platformUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group text-muted-foreground/50 hover:text-primary inline-flex items-center gap-1 text-xs transition-colors duration-300"
      >
        Visit
        <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:translate-x-px group-hover:-translate-y-px" />
      </a>
    </div>
    <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
      {description}
    </p>
    <div>
      {writingsList.map((writing) => (
        <WritingCard key={writing.title} writing={writing} />
      ))}
    </div>
  </div>
);

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function FeaturedWritingsPage() {
  const nshssWritings = writings.filter((w) => w.platform === "NSHSS");
  const amplifyWritings = writings.filter(
    (w) => w.platform === "Amplify Afghan Women"
  );

  return (
    <>
      {/* Header */}
      <section className="py-28 md:py-40">
        <div className="container">
          <div className="max-w-4xl">
            <Link
              href="/hervoice"
              className="group text-muted-foreground hover:text-foreground mb-10 inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Back to HerVoice
            </Link>

            <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
              Published Stories
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
              Featured Writings from Our Partners
            </h1>
            <p className="text-muted-foreground mt-8 max-w-xl text-base leading-relaxed md:text-lg">
              Afghan girls and women sharing their truths with the world —
              through the platforms of NSHSS and Amplify Afghan Women.
            </p>

            <div className="border-border/30 mt-12 flex items-center gap-8 border-t pt-8">
              <div>
                <p className="font-serif text-4xl">{writings.length}</p>
                <p className="text-muted-foreground mt-1 text-xs font-semibold tracking-[0.2em] uppercase">
                  Total Pieces
                </p>
              </div>
              <div className="bg-border/40 h-8 w-px" />
              <div>
                <p className="font-serif text-4xl">2</p>
                <p className="text-muted-foreground mt-1 text-xs font-semibold tracking-[0.2em] uppercase">
                  Partner Platforms
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-28 md:py-40">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-24">
            <PlatformSection
              platform="National Society of High School Scholars (NSHSS)"
              platformUrl="https://www.nshss.org/"
              description="NSHSS is an international honor society based in Atlanta, Georgia, that publishes student voices and advocates for youth leadership."
              writingsList={nshssWritings}
            />
            <PlatformSection
              platform="Amplify Afghan Women"
              platformUrl="https://sites.google.com/view/amplifyafghans/home"
              description="Based in Melbourne, Australia, Amplify Afghan Women is a publication platform dedicated to amplifying the voices of Afghan women and girls across the world."
              writingsList={amplifyWritings}
            />
          </div>
        </div>
      </section>

      {/* Dark footer section */}
      <section className="bg-foreground text-background py-28 md:py-40">
        <div className="container">
          <div className="max-w-4xl">
            <p className="text-background/40 text-xs font-semibold tracking-[0.3em] uppercase">
              Our Partners
            </p>
            <h2 className="text-background mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Stories reaching the world.
            </h2>
            <p className="text-background/60 mt-6 max-w-xl text-base leading-relaxed">
              These organizations help Afghan girls share their stories with a
              global audience. Visit their platforms to read more published
              work.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://www.nshss.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="group border-background/20 text-background hover:bg-background/10 inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              >
                Visit NSHSS
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-px group-hover:-translate-y-px" />
              </a>
              <a
                href="https://sites.google.com/view/amplifyafghans/home"
                target="_blank"
                rel="noopener noreferrer"
                className="group border-background/20 text-background hover:bg-background/10 inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              >
                Visit Amplify Afghan Women
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-px group-hover:-translate-y-px" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
