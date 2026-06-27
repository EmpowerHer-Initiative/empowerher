import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  Globe,
  Lightbulb,
  Mail,
  Star,
  Trophy,
} from "lucide-react";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.pages.writingContest.title} — ${siteConfig.name}`,
  description: siteConfig.pages.writingContest.description,
};

const FORM_URL = "https://forms.gle/J5D6atwg4cH5yicf9";

/* ─── Hero ───────────────────────────────────────────────────────────────────── */

const Hero = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="grid items-center gap-16 lg:grid-cols-[1fr_1fr]">
        <div className="max-w-xl">
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            HerVoice · 2026
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-7xl">
            Writing Contest
          </h1>
          <p className="text-muted-foreground mt-8 text-base leading-relaxed md:text-lg">
            HerVoice is EmpowerHer&apos;s creative storytelling platform where
            students share original writing and express themselves freely. We
            believe in the power of words to heal, connect, and inspire change.
          </p>
          <div className="border-primary/30 bg-primary/[0.05] border-l-primary mt-8 rounded-2xl border border-l-4 p-5">
            <p className="text-foreground text-sm leading-relaxed">
              HerVoice is directed by our CWS Mentor and Co-Founder,{" "}
              <span className="font-semibold">Nahid Karimi</span>.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-primary text-primary-foreground hover:shadow-primary/25 inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
            >
              Submit Your Entry
              <ExternalLink className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/hervoice"
              className="border-border/60 text-foreground/70 hover:border-primary hover:text-foreground inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              Explore HerVoice
            </Link>
          </div>
        </div>

        <div className="border-border/30 overflow-hidden rounded-3xl border">
          <img
            src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTUAlOSJMuHB63DFcWbZp7rAk9VUJPgitsO2Ca"
            alt="HerVoice 2026 Writing Contest"
            className="aspect-[4/3] h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
);

/* ─── About the Contest ──────────────────────────────────────────────────────── */

const AboutContest = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-4xl">
        <h2 className="flex items-center gap-3 font-serif text-3xl leading-tight md:text-4xl">
          <BookOpen className="text-primary size-8 shrink-0" />
          About the Contest
        </h2>
        <p className="text-muted-foreground mt-8 text-lg leading-[1.8]">
          EmpowerHer&apos;s HerVoice initiative aims to provide a space where
          Afghan girls can truly express their stories, feelings, and
          experiences freely. This contest is designed to reflect the realities
          Afghan girls and women are facing under the oppressive Taliban regime.
          Their educational, social, and economic lives have been shattered, and
          through this contest, we seek to share these narratives, commemorate
          the hardships Afghan girls and women continue to endure, and reward
          and recognize their resilience, courage, and motivation to push
          forward in the face of adversity.
        </p>
      </div>
    </div>
  </section>
);

/* ─── Writing Prompt ─────────────────────────────────────────────────────────── */

const WritingPrompt = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-4xl text-center">
        <Lightbulb className="text-primary mx-auto size-12" />
        <p className="text-primary mt-6 text-xs font-semibold tracking-[0.3em] uppercase">
          Writing Prompt / Theme
        </p>
        <div className="border-primary/20 bg-background mt-8 rounded-3xl border p-10 shadow-sm md:p-16">
          <p className="font-serif text-3xl leading-snug md:text-4xl lg:text-5xl">
            &ldquo;A time when you felt strength in being a woman/girl&rdquo;
          </p>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Who Can Participate ────────────────────────────────────────────────────── */

const whoCanParticipate = [
  "All Afghan girls and women regardless of any age can submit their writings. Men are not eligible.",
  "You can submit your writings if you live in Afghanistan ONLY. Submissions from other countries are not accepted.",
  "You must have an intermediate English level and be able to express your ideas and stories clearly without any help from AI (ChatGPT or any other platforms).",
  "You must have a valid ID, contact information, and be able to receive our cash prizes, if you are selected as a winner.",
];

const WhoCanParticipate = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-4xl">
        <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
          Eligibility
        </p>
        <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
          Who Can Participate
        </h2>
        <div className="mt-12 grid gap-4">
          {whoCanParticipate.map((item) => (
            <div
              key={item}
              className="border-border/60 bg-background flex items-start gap-4 rounded-2xl border p-6 shadow-sm"
            >
              <CheckCircle2 className="text-primary mt-0.5 size-6 shrink-0" />
              <p className="text-foreground/80 text-base leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ─── Submission Requirements ────────────────────────────────────────────────── */

const submissionRules = [
  "Articles and biographies are not accepted. We value creativity and your ability to work with language to produce a meaningful and original piece of writing.",
  "All submissions must be original work written by the participant and not previously published elsewhere.",
  "Entries must be written in English.",
  "Each entry must have a title.",
  "Each participant may submit one entry only.",
  "Submissions must reflect the writer's own lived experience or personal perspective. Plagiarism or AI-generated content is strictly prohibited.",
  "Writing must align with the theme and purpose of the HerVoice Writing Contest.",
  "Submissions must be respectful and must not include hate speech, harassment, or harmful content.",
  "All entries must be submitted by the official deadline; late submissions will not be considered.",
];

const SubmissionRequirements = () => (
  <section className="bg-foreground/[0.025] py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-5xl">
        <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
          Guidelines
        </p>
        <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
          Submission Requirements
        </h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Format options */}
          <div className="border-border/60 bg-background rounded-3xl border p-8 shadow-sm">
            <h3 className="font-serif text-2xl">Format Options</h3>
            <div className="mt-6 space-y-4">
              <div className="bg-muted/60 rounded-2xl p-6">
                <p className="text-foreground text-lg font-semibold">Stories</p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Maximum 900 words (any type of writing; must be your original
                  work and not written by Generative AI).
                </p>
              </div>
              <div className="bg-muted/60 rounded-2xl p-6">
                <p className="text-foreground text-lg font-semibold">Poems</p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Maximum 40 lines.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-l-4 border-red-200 border-l-red-600 bg-red-50 p-4">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-600" />
                <p className="text-sm leading-relaxed text-red-800">
                  Submissions that exceed the stated word or line limits will
                  not be accepted.
                </p>
              </div>
            </div>
          </div>

          {/* Important rules */}
          <div className="border-border/60 bg-background rounded-3xl border p-8 shadow-sm">
            <h3 className="font-serif text-2xl">Important Rules</h3>
            <ul className="mt-6 space-y-4">
              {submissionRules.map((rule) => (
                <li key={rule} className="flex items-start gap-3">
                  <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
                  <span className="text-foreground/80 text-sm leading-relaxed">
                    {rule}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── How to Submit ──────────────────────────────────────────────────────────── */

const HowToSubmit = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-3xl">
        <div className="border-primary/20 bg-primary/[0.04] rounded-3xl border p-10 text-center md:p-16">
          <ExternalLink className="text-primary mx-auto size-12" />
          <h2 className="mt-6 font-serif text-3xl leading-tight md:text-4xl">
            How to Submit
          </h2>
          <p className="text-foreground/80 mt-5 text-lg font-medium">
            You must submit your written pieces by clicking on this form:
          </p>
          <div className="mt-8">
            <Link
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-primary text-primary-foreground hover:shadow-primary/25 inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
            >
              Submit Your Entry
              <ExternalLink className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-400/50 bg-amber-50 p-5 text-left">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <p className="text-sm leading-relaxed text-amber-900">
              We do not accept submissions through any of our email addresses.
              Please ONLY submit by clicking on the form above.
            </p>
          </div>
          <p className="text-muted-foreground mt-6 text-sm">
            For any questions please email us at{" "}
            <a
              href="mailto:hervoice@empowerher-initiative.org"
              className="text-primary font-semibold underline underline-offset-4"
            >
              hervoice@empowerher-initiative.org
            </a>
          </p>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Deadlines ──────────────────────────────────────────────────────────────── */

const deadlines = [
  {
    date: "March 1",
    title: "Contest Opens",
    description: "Application form goes live and submissions begin.",
  },
  {
    date: "March 21",
    title: "Submission Deadline",
    description: "All entries must be submitted by this date.",
  },
  {
    date: "March 22 – May 1",
    title: "Review Period",
    description: "Judges evaluate all submissions.",
  },
  {
    date: "May 2",
    title: "Notification Day",
    description: "All participants receive an update on their submissions.",
  },
];

const Deadlines = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-5xl">
        <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
          Timeline
        </p>
        <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
          Important Deadlines
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {deadlines.map((deadline, i) => (
            <div
              key={deadline.title}
              className="border-border/60 bg-background border-l-primary relative overflow-hidden rounded-2xl border border-l-4 p-7 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary text-primary-foreground flex size-12 shrink-0 items-center justify-center rounded-xl font-serif text-lg">
                  {i + 1}
                </div>
                <div>
                  <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
                    <Calendar className="size-3.5" />
                    {deadline.date}
                  </span>
                  <h3 className="mt-3 font-serif text-2xl">{deadline.title}</h3>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                    {deadline.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl border border-amber-400/50 bg-amber-50 p-5 text-center">
          <AlertTriangle className="size-5 shrink-0 text-amber-600" />
          <p className="text-sm font-medium text-amber-900">
            Note: Deadlines are subject to extension if needed.
          </p>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Awards & Recognition ───────────────────────────────────────────────────── */

const prizes = [
  { place: "1st Place", amount: "400", accent: "text-amber-600 bg-amber-100" },
  { place: "2nd Place", amount: "300", accent: "text-slate-600 bg-slate-100" },
  {
    place: "3rd Place",
    amount: "200",
    accent: "text-orange-600 bg-orange-100",
  },
  {
    place: "4th Place",
    amount: "150",
    accent: "text-emerald-600 bg-emerald-100",
  },
  { place: "5th Place", amount: "50", accent: "text-violet-600 bg-violet-100" },
];

const recognitionBenefits = [
  {
    icon: Globe,
    title: "Publication on HerVoice Platform",
    description:
      "All 5 cash prize winners and 3 honorable mentions will have their stories published on the HerVoice platform, sharing their voices with the wider EmpowerHer community.",
  },
  {
    icon: Star,
    title: "Featured on NSHSS Website",
    description:
      "Stories from the 1st, 2nd, and 3rd place winners will also be featured on our partner organization's website, The National Society of High School Scholars (NSHSS), reaching audiences in over 170 countries.",
  },
  {
    icon: Award,
    title: "Priority for Future Opportunities",
    description:
      "Cash prize winners and honorable mentions will be prioritized for future EmpowerHer workshops and opportunities to use our Student Project Roadmap to create their own impact projects. (Acceptance to workshops is not guaranteed, but their applications will receive priority consideration.)",
  },
  {
    icon: DollarSign,
    title: "Cash Prizes",
    description:
      "Winners will receive cash prizes ranging from $50 to $400 USD to support their educational and personal development goals.",
  },
];

const Awards = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-5xl">
        <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
          Recognition
        </p>
        <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
          Awards &amp; Recognition
        </h2>
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
          We carefully review all submissions with full consideration of each
          participant&apos;s circumstances. From this contest, we will select{" "}
          <span className="text-foreground font-semibold">5 winners</span> and{" "}
          <span className="text-foreground font-semibold">
            3 honorable mentions
          </span>
          .
        </p>

        {/* Prizes */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {prizes.map((prize) => (
            <div
              key={prize.place}
              className="border-border/60 bg-background flex flex-col items-center rounded-3xl border p-8 text-center shadow-sm"
            >
              <div
                className={`flex size-20 items-center justify-center rounded-full ${prize.accent}`}
              >
                <Trophy className="size-9" />
              </div>
              <h3 className="mt-5 font-serif text-2xl">{prize.place}</h3>
              <p className="text-primary mt-2 font-serif text-5xl">
                ${prize.amount}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">US Dollars</p>
            </div>
          ))}
        </div>

        {/* Recognition benefits */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {recognitionBenefits.map((b) => (
            <div
              key={b.title}
              className="border-border/60 bg-background rounded-3xl border p-8 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                  <b.icon className="size-5" />
                </div>
                <h3 className="text-lg font-semibold">{b.title}</h3>
              </div>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ─── Judges ─────────────────────────────────────────────────────────────────── */

const judges = [
  {
    name: "Dr. Susan M. Blaustein",
    description:
      "Dr. Susan M. Blaustein is the Founding Board Chair and President of WomenStrong International, a global nonprofit that supports local feminist leaders advancing the rights of women and girls worldwide. She previously co-founded and directed the Millennium Cities Initiative at Columbia University's Earth Institute and has worked on conflict prevention and international justice with leading global organizations. A writer and journalist, she has reported on global politics and social justice for major publications including The New Yorker and The Wall Street Journal. Dr. Blaustein teaches at Columbia University's Climate School, holds a doctorate from Yale University, was a Harvard Junior Fellow, and has received numerous honors, including a Guggenheim Fellowship and the Ban Ki-moon Award for Women's Empowerment.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTnlKrZzPQgRrhjkv2mNoAG6Y5KExwBW7Cqs1O",
  },
  {
    name: "Dr. Ellen Leggett",
    description:
      "Dr. Ellen Leggett is a psychologist with a lifelong passion for supporting the education of girls and women. She graduated from Mount Holyoke College, the first U.S. college founded for women, and was Associate Dean of Students at Scripps College, an esteemed California college for women. Most recently, she has been Professor of Psychology at the University of Southern California and Founding Director of the Master's in Applied Psychology program there, where she has taught students from all over the world. She holds master's and doctoral degrees in Human Development and Education from Harvard University.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT5RG1ajWxDjwpl6zcWuZFSE0gC1TOnBMHdPh3",
  },
  {
    name: "Dr. Sonia Palmieri",
    description:
      "Associate Professor Dr. Sonia Palmieri is Head of the Department of Pacific Affairs at the Coral Bell School of Asia and Pacific Affairs, Australian National University. Her research focuses on women's leadership in political institutions, particularly gender-sensitive parliaments. She is a leading contributor to both the theory and practice of inclusive and feminist research methodologies.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTK2M6BgCVy1oGkRMuS0Lravl9JbQIxWFcNhtq",
  },
  {
    name: "Dr. Marilyn Sides",
    description:
      "Dr. Marilyn Sides is an Associate Teaching Professor in the Department of English and Creative Writing at Wellesley College, where she also serves as Director of Creative Writing. She is affiliated with the Comparative Literary Studies Program. Marilyn is the author of the short story collection The Island of the Mapmaker's Wife and the novel The Genius of Affection. At Wellesley, she teaches creative writing as well as literature courses.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTEXcdsbfRbjSv9fDHMpJXBriOWVtPmoQZNC3q",
  },
  {
    name: "Patrick M. Erwin",
    description:
      "Patrick M. Erwin is the Curriculum Director at the Maxwell Leadership Foundation, with extensive experience in education and leadership development. He previously served 17 years as a high school band director in Cobb County, Georgia. Patrick holds degrees in Political Science, Music Education, and Leadership, and is an award-winning speaker who presents nationally on leadership, student engagement, and professional growth.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTPp5idDYhZvxtB3ycfP5jQXiMRAWOCrnJ2oYe",
  },
  {
    name: "Andrew McPeak",
    description:
      "Andrew McPeak is an author, researcher, and expert on emerging generations with over a decade of experience working with young adults across education and professional settings. He is the co-host of the School on a Mission Podcast, co-author of Marching off the Map (2017) and Generation Z Unfiltered (2019), and the author of Ready for Real Life (2023).",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTtLlBep7RH9uDZYO2eqksXLbgS5pT0fia4Unh",
  },
  {
    name: "Bella Fisher",
    description:
      "Bella Fisher is a junior at Miss Hall's School in Massachusetts and grew up on a farm in Berkshire County. She has a strong interest in creative writing and the arts, particularly prose and fiction, and enjoys exploring literary and artistic projects. She is an editor at the literary magazine Girls Write the World, where she helps amplify young voices through writing and editorial work. Bella is passionate about supporting other young writers and aspires to publish her own work in the future.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT3cvDJJKpPsIbjXnuoAM3O2JygVY8KzGFtD6k",
  },
  {
    name: "Maia Roberts",
    description:
      "Maia Roberts is a junior at Miss Hall's School, where she pursues advanced coursework in English and history with a particular focus on feminist studies. Her academic work has earned her placement on the Head's List each semester of high school. She is an editor at the international literary journal Girls Right the World, where she contributes to elevating young voices through writing and editorial work. Maia believes in the importance of using literature and education to explore gender equity and amplify underrepresented perspectives.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT1n9bdNM2QzEuUaBX9YLlpwGm6Z8oisI4dSv7",
  },
  {
    name: "Juliet Hopkins",
    description:
      "Juliet Hopkins is a junior at Miss Hall's School and is originally from Rabun County, Georgia. She has a strong interest in creative writing and oil painting, and she balances her artistic pursuits with athletics as a varsity volleyball player. She is an editor at the literary magazine Girls Right the World, where she helps amplify young voices through writing and editorial work. Juliet believes in the importance of uplifting the voices of refugee girls and learning more about their experiences and backgrounds.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTDbXy77h0fiZ3z8JjCWsbc2laUL6tAeqPnMNS",
  },
];

const Judges = () => (
  <section className="bg-foreground/[0.025] py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-6xl">
        <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
          The Panel
        </p>
        <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
          Our Judges
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {judges.map((judge) => (
            <div key={judge.name}>
              <div className="aspect-square overflow-hidden rounded-2xl">
                <img
                  src={judge.image}
                  alt={judge.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-5 font-serif text-2xl">{judge.name}</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {judge.description}
              </p>
            </div>
          ))}
        </div>

        {/* Thank you + sponsors */}
        <div className="mt-20 space-y-10">
          <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base leading-relaxed font-medium md:text-lg">
            We thank our judges for their support of this contest and appreciate
            their time and effort to help Afghan girls share their voices
            globally.
          </p>
          <div className="border-border/60 bg-background rounded-3xl border p-10 text-center shadow-sm md:p-14">
            <p className="mx-auto max-w-3xl font-serif text-xl leading-relaxed md:text-2xl">
              Special thanks to our sponsors, the Solebury School community in
              Pennsylvania, United States, and the Afghan Girls Financial
              Assistance Fund (AGFAF) in New Jersey, United States, for their
              generous donations to our efforts to uplift and support Afghan
              girls through HerVoice.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <div className="bg-muted/50 size-56 overflow-hidden rounded-2xl">
                <img
                  src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTytzgM9tSQWCPTDEdgq92vwoMZR87xBLuIAfs"
                  alt="Solebury School"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="bg-background border-border/60 flex w-56 items-center justify-center overflow-hidden rounded-2xl border p-4">
                <img
                  src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTpavV7aqrM0zsm5gThJ2eDxZtjCFUdBGElvb1"
                  alt="AGFAF"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function WritingContestPage() {
  return (
    <>
      <Hero />
      <AboutContest />
      <WritingPrompt />
      <WhoCanParticipate />
      <SubmissionRequirements />
      <HowToSubmit />
      <Deadlines />
      <Awards />
      <Judges />
    </>
  );
}
