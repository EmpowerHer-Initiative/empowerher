import type { Metadata } from "next";
import { ArrowUpRight, ExternalLink, MapPin } from "lucide-react";

import { siteConfig } from "@/lib/site";

import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: `${siteConfig.pages.resources.title} — ${siteConfig.name}`,
  description: siteConfig.pages.resources.description,
};

/* ─── Data ──────────────────────────────────────────────────────────────────── */

type Resource = {
  id: number;
  name: string;
  location: string;
  description: string;
  href: string;
  image?: string;
};

const resources: Resource[] = [
  {
    id: 1,
    name: "Advocacy to Stop Gender Apartheid",
    location: "Virtual",
    description:
      "This is an Advocacy Course on the Codification of Gender Apartheid as a Crime Against Humanity. It examines historical and contemporary examples, legal frameworks, and ongoing efforts to establish gender apartheid within international criminal law. Participants will gain insight into the social, political, and legal dimensions of gender apartheid, equipping them with the tools to advocate for accountability and justice. The course emphasizes the importance of preparing individuals and organizations before they embark on advocacy projects to ensure they have the knowledge, skills, and network that will set them up for success.",
    href: "https://courses.darakhtdanesh.org/local/search/coursedetails.php?id=101",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTaaazlzAtfy8gUMVlFj5QpoO3BkxsndH9Dm2E",
  },
  {
    id: 2,
    name: "Shafia Education Access",
    location: "Virtual",
    description:
      "The Shafia Education Access Program provides small grants to Afghan women and girls to support their education by covering essential costs such as tuition, learning devices, internet packages, and transportation. Open to learners of all ages and education levels, the program prioritizes the most urgent needs and requires a complete application and supporting documents. Applicants may receive support for one item per application cycle, with a maximum of 45,000 AFN in funds or in-kind support.",
    href: "https://righttolearn.ca/shafia/",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTBRQC7aZcQ1oEZ9sIXj8tePOrDbdN2iaU7v5q",
  },
  {
    id: 3,
    name: "Sahar Education",
    location: "Virtual & In Person (Afghanistan)",
    description:
      "Sahar provides safe, innovative education programs for Afghan girls and women, including secret tech and literacy classes, online learning in English and math, Coursera-based skills training, and support resources like mental health, job prep, and scholarships—all built to empower learners in even the most challenging conditions.",
    href: "https://www.sahareducation.org/current-programs",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT0La8F8o1jbZo7DsLPidlGr6Uf2HKquxXJ3CN",
  },
  {
    id: 4,
    name: "LEARN Afghan",
    location: "Virtual & In Person (Afghanistan)",
    description:
      "LEARN provides free Pashto- and Dari-language education for Grades 1–12, reaching millions via online schools and offline apps in STEM subjects, coding, biophysics, and more. They operate digital schools and community centers across provinces like Kandahar, Herat, and Samangan and deliver humanitarian support—including food aid, menstrual health training, and maternal care—while empowering girls and youth through digital skills and leadership development.",
    href: "https://learnafghan.org",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTCBxOdUNp0xR3LuJK2fkyDlQSq5OVpmHz6CTh",
  },
  {
    id: 5,
    name: "Pathway to Tech (PAT) Project",
    location: "Virtual",
    description:
      "Offered by the Muslim Association of Puget Sound in partnership with Skillspire, the PAT Project equips underrepresented individuals—including immigrants, refugees, and veterans—with high-quality STEM training, financial aid, laptops, and career placement in the tech industry. The program provides hands-on courses in web development, cybersecurity, and data analytics, with full support for job readiness and long-term success in tech.",
    href: "https://9npnmhx8bgq.typeform.com/to/ar3ib1CJ?typeform-source=www.skillspire.net",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTqY4MIVBYobifLHTavDVU7h0yBGlSc4z8XEQn",
  },
  {
    id: 6,
    name: "English for Education & Career Success",
    location: "Virtual",
    description:
      "English for Education & Career Success is a free online English program for Afghan women, offered by Right to Learn Afghanistan in partnership with Arizona State University. Designed for low-bandwidth and self-paced learning, it includes Levels 1–4 for everyday English, Levels 5–8 for critical thinking and academic writing, and a Business English course covering proposals, meetings, and contracts. After a placement test, students are enrolled in the right level and can study on phones, tablets, or laptops from anywhere.",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSfCgJA6uv1UWvzOIxOrTR9QfnZMWa2sW-ymhUR934LES337VA/viewform",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPThka7jXymYWNaVI2CGjn5RkZbu3BUS0i97AMX",
  },
  {
    id: 7,
    name: "Afghans for Progressive Thinking (APT) / APT Youth",
    location: "Virtual",
    description:
      "Afghans for Progressive Thinking (APT), also known as APT Youth, empowers Afghan women and youth through education, advocacy, and mentorship. Its Mentorship for Higher Education program connects young Afghan women with experienced mentors who guide them in applying to universities and scholarships, improving academic writing, and building confidence. The program offers workshops and mentorship tracks such as advocacy and academic writing to meet individual needs. APT aims to help Afghan girls gain access to global education and develop into leaders who promote equality and positive change in their communities.",
    href: "https://aptyouth.org",
    image:
      "https://aptyouth.org/wp-content/uploads/2025/03/APT-Logo-English-Transparent-1024x447-1-1.png",
  },
  {
    id: 8,
    name: "Afghan Girls Financial Assistance Fund (AGFAF)",
    location: "Virtual",
    description:
      "The Afghan Girls Financial Assistance Fund (AGFAF) is a nonprofit organization that empowers Afghan girls and young women through education. It provides scholarships and financial aid for students to attend schools and universities in Afghanistan and abroad. AGFAF also supports projects like coding classes, STEAM camps, and community initiatives, and has established libraries to expand access to learning. With over $10 million awarded in scholarships and partnerships with 50 institutions, AGFAF continues to help Afghan girls pursue education and become future leaders.",
    href: "https://agfaf.org",
    image:
      "https://img1.wsimg.com/isteam/ip/b9e5b1b2-d8b6-407d-8b50-3fbe8aa6c0f5/blob-697b46a.png/:/rs=w:400,h:400,cg:true,m/cr=w:400,h:400/qt=q:95",
  },
  {
    id: 9,
    name: "Women For Afghan Women (WAW)",
    location: "Virtual & In Person",
    description:
      "Women for Afghan Women (WAW) is a nonprofit founded in 2001 that empowers Afghan women and girls through protection, education, and advocacy. It provides legal aid, shelter, counseling, and skills training for survivors of violence, while also supporting displaced families and immigrant women in the U.S. WAW works to advance gender equality and envisions a world where Afghan women and girls live with peace, freedom, and equal rights.",
    href: "https://womenforafghanwomen.org",
    image:
      "https://womenforafghanwomen.org/wp-content/uploads/2025/03/WAW-Wide-Navy-Text.png",
  },
  {
    id: 10,
    name: "Learning Baskets (Right to Learn Afghanistan)",
    location: "Virtual",
    description:
      "Right to Learn Afghanistan runs the Learning Baskets program, which provides families with educational materials to support learning at home, including storybooks, literacy activities, and recipes. Their Learning Plus Baskets combine these learning materials with essential food staples—like rice, flour, lentils, and tea—so families facing economic hardship can continue learning while meeting basic needs. You can contact info@righttolearn.ca for more information or to get involved.",
    href: "https://righttolearn.ca/learning-baskets/",
    image:
      "https://righttolearn.ca/wp-content/uploads/2020/12/RTL_Logo-Secondary-Descriptor-Retina.png",
  },
  {
    id: 11,
    name: "United World Colleges (UWC) — Afghanistan",
    location: "In Person — Fully Funded Scholarship",
    description:
      "United World Colleges (UWC) is a global educational movement with 18 international schools and over 70 national committees. Founded in 1962, UWC aims to unite people, nations, and cultures for peace. Its two-year residential program focuses on the IB Diploma or IB Career-related Programme, emphasizing academics, leadership, community service, and personal growth. Students are selected for potential and alignment with UWC values, not financial means.\nThe UWC National Committee of Afghanistan invites applications from Afghan citizens in Afghanistan or as refugees, born August 1, 2007 – August 15, 2011. Applicants need a valid Tazkira and Afghan passport (or submit by stage two). The application is online, in English, and requires parental consent.\nSelection is based on intellectual curiosity, social competence, resilience, integrity, and academic potential. Students are responsible for travel and visa arrangements.\nDeadline: October 31, 2025, 11:59 p.m. Kabul time. Questions: chair.gh@af.uwc.org or selections@af.uwc.org. Beware of scammers.",
    href: "https://apply.uwc.org/prog/uwc_application_for_afghans_2026_entry/",
    image:
      "https://apply.uwc.org/media/assets2/reviewrooms/uwci/logo/UWC_Logo.jpg",
  },
  {
    id: 12,
    name: "AVESTA-CACC Scholarship Program",
    location: "Virtual",
    description:
      "The AVESTA-CACC Scholarship Program offers 50 fully funded online diploma scholarships for Afghan girls through a partnership between the Avesta Initiative for Higher Learning and Canadian All Care College (CACC). Participants can study remotely in fields such as Banking & Financial Services, Medical Office Administration, Digital Marketing, and Supply Chain Management & Logistics. Applicants must have completed high school, possess good English skills, and have internet access. The program helps Afghan girls gain career-ready skills and pursue higher education opportunities. Applications are open from October 3 to October 31, 2025, and classes begin in January 2026.\n📧 Contact Email: applications@avestainitiative.org\n🌐 Website: www.avestainitiative.org",
    href: "https://avestainitiative.org/avesta-news/f/avesta-cacc-scholarship-program-application-guidlines",
    image:
      "https://img1.wsimg.com/isteam/ip/be2d2eaa-39da-4375-bc84-1cd6c41bbaef/Final%20Avesta%20brand.png/:/rs=w:370,h:208,cg:true,m/cr=w:370,h:208/qt=q:95",
  },
];

/* ─── Resource Card ──────────────────────────────────────────────────────────── */

const ResourceCard = ({ resource }: { resource: Resource }) => (
  <div className="group border-border/40 bg-background hover:border-primary/30 hover:shadow-primary/5 flex flex-col gap-8 rounded-3xl border p-8 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl lg:flex-row lg:p-10">
    {/* Content */}
    <div className="flex flex-1 flex-col items-start gap-4">
      <h3 className="font-serif text-2xl leading-tight md:text-3xl">
        {resource.name}
      </h3>

      <span className="text-muted-foreground inline-flex items-center gap-2 text-sm">
        <MapPin className="size-4" />
        {resource.location}
      </span>

      <p className="text-muted-foreground text-base leading-relaxed whitespace-pre-line">
        {resource.description}
      </p>

      <a
        href={resource.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group/btn bg-primary text-primary-foreground hover:shadow-primary/25 mt-auto inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg active:scale-[0.98]"
      >
        View
        <ExternalLink className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-0.5" />
      </a>
    </div>

    {/* Logo */}
    {resource.image && (
      <div className="border-border/30 relative flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-white p-6 lg:aspect-square lg:w-72">
        <img
          src={resource.image}
          alt={resource.name}
          className="max-h-full max-w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
        />
      </div>
    )}
  </div>
);

/* ─── Page Header ────────────────────────────────────────────────────────────── */

const Header = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="max-w-3xl">
        <Reveal asChild>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
            Education &amp; Opportunities
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
            Resources
          </h1>
        </Reveal>
        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-8 max-w-xl text-base leading-relaxed md:text-lg">
            A curated collection of educational programs, scholarships, and
            opportunities for Afghan girls and women — vetted by our team and
            organized to help you find the right path forward.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── Resource List ──────────────────────────────────────────────────────────── */

const ResourceList = () => (
  <section className="pb-28 md:pb-40">
    <div className="container">
      <div className="mx-auto max-w-5xl">
        <Reveal asChild>
          <p className="text-muted-foreground mb-8 text-sm">
            Number of Resources found:{" "}
            <span className="text-foreground font-semibold">
              {resources.length}
            </span>
          </p>
        </Reveal>
        <div className="space-y-6">
          {resources.map((resource) => (
            <Reveal key={resource.id}>
              <ResourceCard resource={resource} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ─── Footer Note ────────────────────────────────────────────────────────────── */

const FooterNote = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <div className="max-w-3xl">
        <Reveal asChild>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
            Know a resource?
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
            Help us grow this list.
          </h2>
        </Reveal>
        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed">
            If you know of an educational resource, scholarship, or program that
            supports Afghan girls and women, we&apos;d love to hear about it.
            Reach out and help us connect more girls with the opportunities they
            deserve.
          </p>
        </Reveal>
        <Reveal asChild delay={240}>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-foreground mt-8 inline-flex items-center gap-2 text-sm font-medium hover:opacity-70"
          >
            {siteConfig.email}
            <ArrowUpRight className="size-4" />
          </a>
        </Reveal>
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
