import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";

const workshopStructure = [
  {
    number: "01",
    title: "Cycle Duration",
    description: "Each workshop runs in 6-week cycles (about 1.5 months).",
  },
  {
    number: "02",
    title: "Sessions per Week",
    description: "Workshops meet twice weekly — on Saturdays and Sundays.",
  },
  {
    number: "03",
    title: "Session Length",
    description: "Each session is 2 hours long.",
  },
  {
    number: "04",
    title: "Saturday Sessions",
    description:
      "Led by assigned mentors. Focused on skill-building, presentations, and guided activities.",
  },
  {
    number: "05",
    title: "Sunday Sessions",
    description:
      "Dedicated to guest speaker presentations, group discussions, lecturers, and Q&A. Covers themes related to empowerment, leadership, storytelling, and resilience.",
  },
  {
    number: "06",
    title: "Workshop Format",
    description:
      "Fully virtual via Google Meet. Materials including assignments and other activities are posted through separate Google Classrooms.",
  },
  {
    number: "07",
    title: "Participant Limit",
    description:
      "Each workshop accepts 16 participants to ensure personalized attention.",
  },
  {
    number: "08",
    title: "Mentorship Style",
    description:
      "Collaborative and discussion-based, encouraging peer support and active participation. Mentors guide students through both personal reflection and project development.",
  },
  {
    number: "09",
    title: "Project-Based Learning",
    description:
      "Participants complete capstone or final projects such as creative writing, art, real-world projects, impact proposals, or cultural presentations reflecting what they have learned.",
  },
];

export const WorkshopStructure = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <Reveal asChild>
          <div>
            <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
              How It Works
            </p>
            <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
              Workshop Structure
            </h2>
          </div>
        </Reveal>
        <Reveal asChild delay={80}>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            Every detail is designed to maximize learning, connection, and
            empowerment.
          </p>
        </Reveal>
      </div>

      {/* Card grid — brand-accented */}
      <Reveal asChild delay={160}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {workshopStructure.map((item) => (
            <div
              key={item.number}
              className="group border-border/40 bg-background hover:border-primary/30 hover:shadow-primary/5 relative flex flex-col overflow-hidden rounded-2xl border p-7 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Top accent bar */}
              <span className="from-primary to-secondary absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-x-100" />

              <div className="flex items-baseline justify-between">
                <span className="text-primary/30 group-hover:text-primary font-serif text-5xl leading-none transition-colors duration-500">
                  {item.number}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal asChild delay={240}>
        <div className="mt-14 flex justify-center">
          <Link
            href="/sisterhood-sessions"
            className="group border-border/60 text-foreground/80 hover:border-primary/30 hover:text-foreground inline-flex items-center gap-2.5 rounded-full border px-8 py-4 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
          >
            Learn About Sisterhood Sessions
            <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);
