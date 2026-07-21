import { BookOpen } from "lucide-react";

import { Reveal } from "@/components/reveal";

export const AboutContest = () => (
  <section className="py-28 md:py-40">
    <div className="container">
      <Reveal asChild>
        <div className="mx-auto max-w-4xl">
          <h2 className="flex items-center gap-3 font-serif text-3xl leading-tight md:text-4xl">
            <BookOpen className="text-primary size-8 shrink-0" />
            About the Contest
          </h2>
          <p className="text-muted-foreground mt-8 text-lg leading-[1.8]">
            EmpowerHer&apos;s HerVoice initiative aims to provide a space where
            Afghan girls can truly express their stories, feelings, and
            experiences freely. This contest is designed to reflect the
            realities Afghan girls and women are facing under the oppressive
            Taliban regime. Their educational, social, and economic lives have
            been shattered, and through this contest, we seek to share these
            narratives, commemorate the hardships Afghan girls and women
            continue to endure, and reward and recognize their resilience,
            courage, and motivation to push forward in the face of adversity.
          </p>
        </div>
      </Reveal>
    </div>
  </section>
);
