import { Reveal } from "@/components/reveal";

const whatWeDo = [
  {
    index: "01",
    title: "Advocacy",
    description:
      "We amplify the voices of Afghan women and girls through storytelling, leadership training, and global engagement. Our initiatives empower them to speak out, share their experiences, and inspire meaningful change toward justice and equal opportunity.",
  },
  {
    index: "02",
    title: "Education & Leadership",
    description:
      "Through skill-based workshops focused on leadership, personal development, communication, and decision-making, we equip Afghan girls with the confidence and tools to lead their communities with strength and purpose.",
  },
  {
    index: "03",
    title: "Creative Expression",
    description:
      "We empower Afghan girls to reclaim their voices through writing, storytelling, and the arts. Our programs provide platforms for creative expression as a powerful form of resistance and healing, helping them share their lived experiences with the world.",
  },
  {
    index: "04",
    title: "Community Engagement",
    description:
      "Our graduates and members can access EmpowerHer's resources and engage with our vibrant community. We support them in creating impactful initiatives both within and outside Afghanistan through virtual and in-person programs.",
  },
];

export const WhatWeDo = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <div className="mb-20 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <Reveal asChild>
          <div>
            <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
              Our Work
            </p>
            <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
              What We Do
            </h2>
          </div>
        </Reveal>
        <Reveal asChild delay={80}>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed md:text-right">
            Four interconnected pillars that work together to create lasting
            change for Afghan women.
          </p>
        </Reveal>
      </div>

      {/* Alternating full-width blocks */}
      <div className="divide-border/40 divide-y">
        {whatWeDo.map((item, i) => (
          <Reveal asChild key={item.index} delay={i * 80}>
            <div
              className={`group hover:bg-muted/30 flex flex-col gap-8 py-10 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:flex-row md:items-center md:gap-0 ${
                i % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="md:w-1/4">
                <span className="text-primary/30 group-hover:text-primary/60 font-serif text-6xl transition-colors duration-500 md:text-8xl">
                  {item.index}
                </span>
              </div>
              <div
                className={`md:w-3/4 ${i % 2 !== 0 ? "md:pr-16" : "md:pl-16"}`}
              >
                <h3 className="text-2xl font-semibold md:text-3xl">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
