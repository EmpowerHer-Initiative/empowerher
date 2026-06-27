import type { Metadata } from "next";
import { ArrowUpRight, Globe, MapPin, Users } from "lucide-react";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.pages.resources.title} — ${siteConfig.name}`,
  description: siteConfig.pages.resources.description,
};

/* ─── Data ──────────────────────────────────────────────────────────────────── */

type ResourceFormat = "Virtual" | "Virtual & In Person" | "In Person";

type Resource = {
  id: number;
  name: string;
  location: string;
  format: ResourceFormat;
  description: string;
  href: string;
  image?: string;
};

const virtualResources: Resource[] = [
  {
    id: 1,
    name: "Advocacy to Stop Gender Apartheid",
    location: "Virtual",
    format: "Virtual",
    description:
      "Advocacy Course on the Codification of Gender Apartheid as a Crime Against Humanity. An essential course for advocates, educators, and anyone committed to ending gender-based systemic oppression.",
    href: "https://courses.darakhtdanesh.org/local/search/coursedetails.php?id=101",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTaaazlzAtfy8gUMVlFj5QpoO3BkxsndH9Dm2E",
  },
  {
    id: 2,
    name: "Shafia Education Access",
    location: "Virtual",
    format: "Virtual",
    description:
      "Provides Afghan girls with structured online learning opportunities designed to bridge the gap left by education bans, connecting them with quality instruction from anywhere in the world.",
    href: "https://righttolearn.ca/shafia/",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTBRQC7aZcQ1oEZ9sIXj8tePOrDbdN2iaU7v5q",
  },
  {
    id: 5,
    name: "Pathway to Tech (PAT) Project",
    location: "Virtual",
    format: "Virtual",
    description:
      "Opens doors for Afghan girls to learn technology skills, offering virtual training that equips them for careers in a digital world — regardless of where they are.",
    href: "https://9npnmhx8bgq.typeform.com/to/ar3ib1CJ",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTqY4MIVBYobifLHTavDVU7h0yBGlSc4z8XEQn",
  },
  {
    id: 6,
    name: "English for Education & Career Success",
    location: "Virtual",
    format: "Virtual",
    description:
      "A virtual English language program designed to help Afghan girls and women develop the communication skills needed to access higher education and career opportunities globally.",
    href: "#",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPThka7jXymYWNaVI2CGjn5RkZbu3BUS0i97AMX",
  },
  {
    id: 7,
    name: "Afghans for Progressive Thinking (APT)",
    location: "Virtual",
    format: "Virtual",
    description:
      "Empowers Afghan youth through education and progressive thinking programs, fostering critical thinking, civic engagement, and leadership development in a virtual community.",
    href: "https://aptyouth.org",
    image:
      "https://aptyouth.org/wp-content/uploads/2025/03/APT-Logo-English-Transparent-1024x447-1-1.png",
  },
  {
    id: 8,
    name: "Afghan Girls Financial Assistance Fund (AGFAF)",
    location: "Virtual",
    format: "Virtual",
    description:
      "A U.S.-based nonprofit dedicated to empowering young Afghan women through education — partnering with universities to provide full financial aid, housing, and mentorship.",
    href: "https://agfaf.org",
    image:
      "https://img1.wsimg.com/isteam/ip/b9e5b1b2-d8b6-407d-8b50-3fbe8aa6c0f5/blob-697b46a.png/:/rs=w:400,h:400,cg:true,m/cr=w:400,h:400/qt=q:95",
  },
  {
    id: 10,
    name: "Learning Baskets (Right to Learn Afghanistan)",
    location: "Virtual",
    format: "Virtual",
    description:
      "Provides curated educational resources and structured learning materials for Afghan girls who cannot access formal schooling.",
    href: "https://righttolearn.ca/learning-baskets/",
    image:
      "https://righttolearn.ca/wp-content/uploads/2020/12/RTL_Logo-Secondary-Descriptor-Retina.png",
  },
  {
    id: 12,
    name: "AVESTA-CACC Scholarship Program",
    location: "Virtual",
    format: "Virtual",
    description:
      "Supports Afghan women in accessing higher education through financial assistance, mentorship, and academic guidance to build the next generation of Afghan leaders.",
    href: "https://avestainitiative.org/avesta-news/f/avesta-cacc-scholarship-program-application-guidlines",
    image:
      "https://img1.wsimg.com/isteam/ip/be2d2eaa-39da-4375-bc84-1cd6c41bbaef/Final%20Avesta%20brand.png/:/rs=w:370,h:208,cg:true,m/cr=w:370,h:208/qt=q:95",
  },
];

const inPersonResources: Resource[] = [
  {
    id: 3,
    name: "Sahar Education",
    location: "Virtual & Afghanistan",
    format: "Virtual & In Person",
    description:
      "Offers both virtual and in-person programs in Afghanistan, providing Afghan girls with access to education and skill-building resources that support their growth and independence.",
    href: "https://www.sahareducation.org/current-programs",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT0La8F8o1jbZo7DsLPidlGr6Uf2HKquxXJ3CN",
  },
  {
    id: 4,
    name: "LEARN Afghan",
    location: "Virtual & Afghanistan",
    format: "Virtual & In Person",
    description:
      "Runs both online and in-person educational programs to support Afghan youth and women, offering accessible pathways to learning in a challenging environment.",
    href: "https://learnafghan.org",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTCBxOdUNp0xR3LuJK2fkyDlQSq5OVpmHz6CTh",
  },
  {
    id: 9,
    name: "Women For Afghan Women (WAW)",
    location: "Virtual & In Person",
    format: "Virtual & In Person",
    description:
      "One of the largest Afghan-led nonprofits in the world, providing critical services including shelter, legal aid, education, and psychosocial support to Afghan women and girls.",
    href: "https://womenforafghanwomen.org",
    image:
      "https://womenforafghanwomen.org/wp-content/uploads/2025/03/WAW-Wide-Navy-Text.png",
  },
  {
    id: 11,
    name: "United World Colleges (UWC) — Afghanistan",
    location: "In Person — Fully Funded",
    format: "In Person",
    description:
      "Offers fully funded scholarship opportunities for Afghan students — providing a transformative international education experience at one of its global campuses. Applications open for 2026 entry.",
    href: "https://apply.uwc.org/prog/uwc_application_for_afghans_2026_entry/",
    image:
      "https://apply.uwc.org/media/assets2/reviewrooms/uwci/logo/UWC_Logo.jpg",
  },
];

/* ─── Row Component ──────────────────────────────────────────────────────────── */

const formatIcon: Record<ResourceFormat, typeof Globe> = {
  Virtual: Globe,
  "Virtual & In Person": Users,
  "In Person": MapPin,
};

const formatColor: Record<ResourceFormat, string> = {
  Virtual: "text-primary bg-primary/8 border-primary/20",
  "Virtual & In Person": "text-foreground/70 bg-muted/60 border-border/50",
  "In Person": "text-foreground/70 bg-muted/60 border-border/50",
};

const ResourceRow = ({ resource }: { resource: Resource }) => {
  const Icon = formatIcon[resource.format];
  const isActive = resource.href !== "#";

  return (
    <div className="group border-border/30 hover:bg-foreground/[0.015] grid grid-cols-[1fr_auto] items-start gap-6 border-b py-7 transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] last:border-0 md:grid-cols-[2fr_3fr_120px_auto] md:items-center">
      {/* Name + badge */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
        <h3 className="text-foreground text-sm leading-snug font-semibold tracking-tight">
          {resource.name}
        </h3>
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase ${formatColor[resource.format]}`}
        >
          <Icon className="size-2.5" />
          {resource.location}
        </span>
      </div>

      {/* Description — hidden on mobile */}
      <p className="text-muted-foreground hidden text-sm leading-relaxed md:block">
        {resource.description}
      </p>

      {/* Logo thumbnail — hidden on mobile */}
      {resource.image ? (
        <div className="border-border/30 hidden h-14 w-[120px] shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white p-2 md:flex">
          <img
            src={resource.image}
            alt={resource.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="hidden w-[120px] md:block" />
      )}

      {/* Link arrow */}
      {isActive ? (
        <a
          href={resource.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${resource.name}`}
          className="border-border/50 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary flex size-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-px group-hover:-translate-y-px" />
        </a>
      ) : (
        <div className="border-border/20 text-muted-foreground/30 flex size-9 shrink-0 items-center justify-center rounded-full border">
          <ArrowUpRight className="size-4" />
        </div>
      )}
    </div>
  );
};

/* ─── Section Group ──────────────────────────────────────────────────────────── */

const ResourceGroup = ({
  label,
  resources,
}: {
  label: string;
  resources: Resource[];
}) => (
  <div>
    <div className="mb-2 flex items-center gap-3">
      <span className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
        {label}
      </span>
      <div className="bg-border/40 h-px flex-1" />
      <span className="text-muted-foreground text-xs">{resources.length}</span>
    </div>
    <div>
      {resources.map((resource) => (
        <ResourceRow key={resource.id} resource={resource} />
      ))}
    </div>
  </div>
);

/* ─── Page Header ────────────────────────────────────────────────────────────── */

const Header = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="max-w-3xl">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
          Education &amp; Opportunities
        </p>
        <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
          Resources
        </h1>
        <p className="text-muted-foreground mt-8 max-w-xl text-base leading-relaxed md:text-lg">
          A curated collection of educational programs, scholarships, and
          opportunities for Afghan girls and women — vetted by our team and
          organized to help you find the right path forward.
        </p>
      </div>
    </div>
  </section>
);

/* ─── Resource List ──────────────────────────────────────────────────────────── */

const ResourceList = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-5xl space-y-20">
        <ResourceGroup label="Virtual" resources={virtualResources} />
        <ResourceGroup label="In Person" resources={inPersonResources} />
      </div>
    </div>
  </section>
);

/* ─── Footer Note ────────────────────────────────────────────────────────────── */

const FooterNote = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <div className="max-w-3xl">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
          Know a resource?
        </p>
        <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
          Help us grow this list.
        </h2>
        <p className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed">
          If you know of an educational resource, scholarship, or program that
          supports Afghan girls and women, we&apos;d love to hear about it.
          Reach out and help us connect more girls with the opportunities they
          deserve.
        </p>
        <a
          href={`mailto:${siteConfig.email}`}
          className="text-foreground mt-8 inline-flex items-center gap-2 text-sm font-medium transition-opacity duration-300 hover:opacity-70"
        >
          {siteConfig.email}
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </div>
  </section>
);

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function ResourcesPage() {
  return (
    <>
      <Header />
      <ResourceList />
      <FooterNote />
    </>
  );
}
