import { Award, BookOpen, ExternalLink, Users } from "lucide-react";

import { Reveal } from "@/components/reveal";

import { ImpactBox, QuoteBox, StoryCard } from "./_shared";

export const Stories = () => (
  <section className="pb-28 md:pb-40">
    <div className="container space-y-10">
      {/* Story 1 — Page of Hope */}
      <Reveal>
        <StoryCard
          logo="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTDSPjOaeh0fiZ3z8JjCWsbc2laUL6tAeqPnMN"
          title="Page of Hope English Online Book Club"
          subtitle="A Success Story of Language, Leadership, and Resilience"
          date="August 2023 – January 2025"
          badge="Featured Story"
          stats={[
            {
              icon: Users,
              value: "11 Students",
              label: "Engaged in weekly sessions",
            },
            { icon: BookOpen, value: "18 Months", label: "Program duration" },
            {
              icon: Award,
              value: "100% Success",
              label: "Advanced to core programs",
            },
          ]}
        >
          <p className="text-foreground/80 text-base leading-relaxed">
            The Page of Hope English Online Book Club was established to support
            Afghan teenagers—particularly girls—who were denied access to formal
            education. Over the course of 18 months, the program offered more
            than English instruction; it provided a platform for personal
            growth, leadership, and connection.
          </p>
          <QuoteBox>
            Founded by EmpowerHer Co-Founder Mahdi Rahimi and generously
            sponsored by the Afghan Girls Financial Assistance Fund (AGFAF), the
            club engaged 11 students in weekly virtual sessions. Despite
            difficult circumstances, participants demonstrated exceptional
            dedication as they explored texts such as <em>Little Women</em> and{" "}
            <em>Dear Martin</em>, strengthening their reading, writing,
            speaking, and critical thinking skills.
          </QuoteBox>
          <p className="text-foreground/80 text-base leading-relaxed">
            Students took on rotating leadership roles, completed capstone
            projects, and participated in interactive activities including
            debates, storytelling, and team-based learning exercises. By the end
            of the program, many had transformed into confident and capable
            communicators.
          </p>
          <ImpactBox title="Impact & Legacy">
            Several participants have since advanced to AGFAF&apos;s core
            educational programs or taken on mentoring roles within EmpowerHer.
            Page of Hope stands as a testament to the power of consistent
            support and the belief that even in the most challenging
            environments, young people—especially girls—can rise, lead, and
            thrive.
          </ImpactBox>
        </StoryCard>
      </Reveal>

      {/* Story 2 — Educational Support */}
      <Reveal>
        <StoryCard
          logo="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTv1o7So50TX8DRt9gfxu6sU74iOHozSwBKGJM"
          title="Educational Support for Afghans"
          subtitle="English Language & Creative Expression"
          date="June 2024 – October 2024"
          stats={[
            {
              icon: Users,
              value: "25 Students",
              label: "Learners of all ages",
            },
            { icon: BookOpen, value: "4 Months", label: "Program duration" },
            {
              icon: Award,
              value: "12 Sessions",
              label: "Focused grammar lessons",
            },
          ]}
        >
          <p className="text-foreground/80 text-base leading-relaxed">
            From June 2024 through October 2024, Nahid Karimi ran a four-month
            English course for 25 Afghan students, many of whom were girls and
            women unable to attend school or university due to restrictive
            conditions. The program welcomed learners of all ages, including
            mothers, and focused on developing foundational skills in reading,
            writing, grammar, listening, and speaking.
          </p>
          <QuoteBox>
            The course emphasized creative expression through writing, classroom
            discussions, and 12 focused grammar sessions for learning English.
            With generous support from AGFAF, we were also able to provide
            monthly internet access to ensure students could attend regularly
            and fully participate in the virtual classroom environment.
          </QuoteBox>
          <ImpactBox title="Timeline & Reach">
            June 2024 – October 2024. Open to girls and women of all ages,
            building confidence and foundational English skills across the
            community.
          </ImpactBox>
        </StoryCard>
      </Reveal>

      {/* Story 3 — Sahar SSO */}
      <Reveal>
        <StoryCard
          logo="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT0La8F8o1jbZo7DsLPidlGr6Uf2HKquxXJ3CN"
          title="Sahar Education's Secret Scholars Online Platform (SSO)"
          subtitle="EmpowerHer × Sahar Education"
          stats={[
            { icon: Users, value: "64 Students", label: "Enrolled learners" },
            {
              icon: BookOpen,
              value: "Math & English",
              label: "Subjects covered",
            },
            {
              icon: Award,
              value: "Self-Paced",
              label: "Fully virtual courses",
            },
          ]}
        >
          <p className="text-foreground/80 text-base leading-relaxed">
            EmpowerHer successfully partnered with Sahar Education to provide 64
            students with access to fully virtual, self-paced Math and English
            courses. This collaboration expanded educational opportunities for
            participants and supported their academic growth through flexible,
            high-quality learning resources.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
            <a
              href="https://web.learningupgrade.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center gap-1.5 text-base font-medium underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              Learn more about the platform
              <ExternalLink className="size-4" />
            </a>
            <a
              href="https://www.sahareducation.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center gap-1.5 text-base font-medium underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              Sahar Education
              <ExternalLink className="size-4" />
            </a>
          </div>
          <QuoteBox author="Z.M.">
            &ldquo;I applied to the SSO platform to improve my skills and
            knowledge. English helped me strengthen my language skills through
            new practical exercises. The platform was easy to use. It was
            supportive and motivating with useful resources that made learning
            more accessible.&rdquo;
          </QuoteBox>
        </StoryCard>
      </Reveal>
    </div>
  </section>
);
