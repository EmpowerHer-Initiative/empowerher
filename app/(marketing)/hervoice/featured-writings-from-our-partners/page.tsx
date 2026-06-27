import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site";

import { Pagination } from "@/components/pagination";

const PER_PAGE = 4;
const BASE_PATH = "/hervoice/featured-writings-from-our-partners";

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
      "In “Building Windows Where They Built Walls,” Nahid Karimi shares her journey from losing her freedom under the Taliban to co-founding EmpowerHer, an organization dedicated to Afghan girls’ education and empowerment. Blending memory, resilience, and poetry, she gives voice to the struggles of women silenced in Afghanistan while opening windows of hope for their future. Her story is not only one of survival but of transformation—turning pain into purpose, and personal loss into a movement that inspires girls to reclaim their voices, pursue education, and imagine a world where their dreams are no longer bound by walls.",
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
      "In “Leading with Resilience: My Journey as an Afghan Student and Advocate,” Mahdi Rahimi reflects on his path from Afghanistan to the United States, navigating displacement, cultural adaptation, and new opportunities. Through personal stories of hardship and determination, he shares lessons on resilience, advocacy, and the power of education. Highlighting the importance of taking initiative, building community, and staying true to one’s mission, Mahdi encourages young leaders to transform challenges into opportunities for impact and empowerment.",
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
      "In this piece, EmpowerHer Creative Arts Workshop mentor and Afghan student-artist Sabira Hussaini reflects on how education and art empower Afghan girls. Through her painting Omulbanin: The Girl Who Dreamed of Harvard and her work with EmpowerHer, she honors lost dreams while inspiring girls to believe in their power to create change.",
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
      "In her powerful article Online Education and the Fight for a Future, Haya — an EmpowerHer student — reflects on the resilience of Afghan girls pursuing education in secret. She highlights how online learning has become a form of resistance and hope, showing that even behind closed doors, dreams of leadership, change, and freedom continue to grow.",
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
      "In this powerful story, Sadaf A, an EmpowerHer student, portrays the journey of Sahar, a young Afghan girl whose dreams of becoming a writer are shattered when a tragedy in Kabul takes her entire family. Struggling through grief, exile, and silence, Sahar finds healing in words. Her writing becomes a voice for thousands of Afghan girls and families silenced by war. The Girl from Kabul is a testament to how storytelling can transform suffering into strength and loss into a legacy that moves the world.",
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
      "In “If the Taliban Had Never Existed” by Sakhydadi, an EmpowerHer student, she imagines an Afghanistan free of fear, where girls like Samira can study, dream, and build futures without restriction. Through her hopeful narrative, Samira contrasts the freedom of this imagined world with the painful reality of generations denied education and dignity under Taliban rule. The piece is both a vision of what could have been and a call to keep alive the dream of a peaceful, inclusive Afghanistan where no voice is silenced and no dream forbidden.",
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
      "In “In Another Time, I Was…” by Suhaila N, an EmpowerHer student, she imagines being transported from present-day Afghanistan into the ancient Kushan Empire, where women were artists, writers, and advisors. Through this journey, she reflects on the courage of Afghan girls today, who resist injustice with pens instead of swords. Blending history, imagination, and present struggles, her story honors the enduring strength of Afghan women and reminds us that their voices must never be forgotten.",
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
      "In \u201cA Bridge Between Two Worlds\u201d by Zahra A, an EmpowerHer student, she drifts between dream and reality, imagining a peaceful world where mothers sing lullabies, fathers laugh with their children, and stories replace war. Waking to the harshness of her own reality, she finds strength not in escape but in resolve\u2014to write, to speak, and to build a bridge from dreams to a future where Afghan children can smile again.",
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
      "In “What if the Taliban Didn’t Exist?” by Farzana A, an EmpowerHer student, the writer imagines a peaceful Afghanistan where girls study freely, families live without fear, and dreams thrive. She contrasts this vision with the harsh reality under Taliban rule but ends with hope, showing that despite oppression, Afghans still hold strong dreams for freedom and a brighter future.",
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
      "In “Why Does Empowering Women Matter?” by Sohaila S, an EmpowerHer student, the writer explains that empowering women strengthens societies through education, healthcare, and leadership. She highlights Afghan women’s struggles under oppression yet praises their courage to keep fighting for freedom. Sohaila calls for unity and support, reminding us that empowering women benefits everyone and builds a more just and hopeful future.",
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
      "In “The Girl with the Borrowed Light” by Zarghona N, an EmpowerHer student, the story follows Laila, a 16-year-old Afghan girl who continues learning in secret despite school bans. Using a borrowed phone and weak internet, she studies online and teaches her younger sister, turning her small, dark room into a place of hope. Through determination and courage, Laila becomes a symbol of resilience—showing that even in darkness, education and hope cannot be taken away.",
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
      "In \u201cAlkahest\u201d by Asma H, an EmpowerHer student, the writer shares her dream of becoming a pilot and her belief that knowledge, like alkahest, can\u2019t be destroyed. Despite Taliban bans, she continued studying in secret, finding strength and hope in learning. Her story shows that even when schools close, the power of education and determination remain unbreakable.",
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
    className="group border-border/20 grid gap-5 border-b py-8 last:border-0 sm:grid-cols-[320px_1fr] sm:gap-8 lg:grid-cols-[400px_1fr]"
  >
    <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
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
  id,
  platform,
  platformUrl,
  description,
  writingsList,
  currentPage,
  totalPages,
  paramName,
  query,
}: {
  id: string;
  platform: string;
  platformUrl: string;
  description: string;
  writingsList: Writing[];
  currentPage: number;
  totalPages: number;
  paramName: string;
  query: Record<string, string | undefined>;
}) => (
  <div id={id} className="scroll-mt-24">
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
    {totalPages > 1 && (
      <div className="mt-10">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={BASE_PATH}
          paramName={paramName}
          query={query}
          hash={`#${id}`}
        />
      </div>
    )}
  </div>
);

/* ─── Page ───────────────────────────────────────────────────────────────────── */

const paginate = (list: Writing[], page: number) => {
  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const items = list.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );
  return { items, currentPage, totalPages };
};

export default async function FeaturedWritingsPage({
  searchParams,
}: {
  searchParams: Promise<{ nshss?: string; amplify?: string }>;
}) {
  const params = await searchParams;

  const nshss = paginate(
    writings.filter((w) => w.platform === "NSHSS"),
    Number(params.nshss) || 1
  );
  const amplify = paginate(
    writings.filter((w) => w.platform === "Amplify Afghan Women"),
    Number(params.amplify) || 1
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
              Afghan girls and women sharing their stories, experiences, and
              perspectives with the world through our network of publication
              partners.
            </p>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-28 md:py-40">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-24">
            <PlatformSection
              id="nshss"
              platform="National Society of High School Scholars (NSHSS)"
              platformUrl="https://www.nshss.org/"
              description="NSHSS is an international honor society based in Atlanta, Georgia, that publishes student voices and advocates for youth leadership."
              writingsList={nshss.items}
              currentPage={nshss.currentPage}
              totalPages={nshss.totalPages}
              paramName="nshss"
              query={{ amplify: params.amplify }}
            />
            <PlatformSection
              id="amplify"
              platform="Amplify Afghan Women"
              platformUrl="https://sites.google.com/view/amplifyafghans/home"
              description="Based in Melbourne, Australia, Amplify Afghan Women is a publication platform dedicated to amplifying the voices of Afghan women and girls across the world."
              writingsList={amplify.items}
              currentPage={amplify.currentPage}
              totalPages={amplify.totalPages}
              paramName="amplify"
              query={{ nshss: params.nshss }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
