import { AlertTriangle, Calendar } from "lucide-react";

import { Reveal } from "@/components/reveal";

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

export const Deadlines = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            Timeline
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
            Important Deadlines
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {deadlines.map((deadline, i) => (
            <Reveal asChild key={deadline.title} delay={i * 80}>
              <div className="border-border/60 bg-background border-l-primary relative overflow-hidden rounded-2xl border border-l-4 p-7 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground flex size-12 shrink-0 items-center justify-center rounded-xl font-serif text-lg">
                    {i + 1}
                  </div>
                  <div>
                    <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
                      <Calendar className="size-3.5" />
                      {deadline.date}
                    </span>
                    <h3 className="mt-3 font-serif text-2xl">
                      {deadline.title}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                      {deadline.description}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal asChild>
          <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl border border-amber-400/50 bg-amber-50 p-5 text-center">
            <AlertTriangle className="size-5 shrink-0 text-amber-600" />
            <p className="text-sm font-medium text-amber-900">
              Note: Deadlines are subject to extension if needed.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
