import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import { siteConfig } from "@/lib/site";

import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: `${siteConfig.pages.afgaf.title} — ${siteConfig.name}`,
  description: siteConfig.pages.afgaf.description,
};

export default function AfgafPage() {
  return (
    <section className="py-28 md:py-40">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          {/* Logo */}
          <Reveal asChild>
            <div className="flex justify-center">
              <img
                src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTpavV7aqrM0zsm5gThJ2eDxZtjCFUdBGElvb1"
                alt="AGFAF — Afghan Girls Financial Assistance Fund"
                className="w-72 object-contain"
              />
            </div>
          </Reveal>

          {/* Title */}
          <Reveal asChild>
            <h1 className="mt-16 font-serif text-3xl leading-tight md:text-4xl">
              Afghan Girls Financial Assistance Fund (AGFAF)
            </h1>
          </Reveal>

          {/* Description */}
          <Reveal asChild>
            <div className="text-muted-foreground mt-8 space-y-6 text-base leading-relaxed">
              <p>
                The Afghan Girls Financial Assistance Fund (AGFAF) is a
                U.S.-based nonprofit organization dedicated to empowering young
                Afghan women through education. Founded in response to the
                systemic barriers Afghan girls face in accessing quality
                education, AGFAF works to identify, support, and sponsor
                talented students who demonstrate academic promise and
                leadership potential.
              </p>
              <p>
                AGFAF partners with high schools, colleges, and universities
                across the United States to provide full financial aid, housing,
                and mentorship for Afghan girls who have limited or no access to
                education in their home country. In addition to academic
                support, AGFAF also offers guidance in college and career
                planning, cultural adjustment, and leadership development,
                helping these students become confident, educated changemakers
                within their communities and beyond.
              </p>
              <p>
                The organization&apos;s mission is rooted in the belief that
                educating girls is one of the most powerful tools for creating
                lasting peace, gender equality, and economic growth in
                Afghanistan and the world.
              </p>
              <p>
                AGFAF continues to grow as a network of scholars, educators,
                host families, and global advocates working together to ensure
                that Afghan girls have the opportunity to learn, lead, and
                thrive.
              </p>
            </div>
          </Reveal>

          {/* Gratitude */}
          <Reveal asChild>
            <div className="border-l-primary bg-primary/[0.05] mt-12 rounded-r-2xl border-l-4 p-8">
              <p className="text-foreground font-semibold italic">
                Our Deepest Gratitude
              </p>
              <blockquote className="text-muted-foreground mt-4 leading-relaxed italic">
                EmpowerHer deeply values the unwavering support of the Afghan
                Girls Financial Assistance Fund (AGFAF). As our primary sponsor
                and partner, AGFAF has played a pivotal role in making many of
                our initiatives and programs possible. For nearly two decades,
                AGFAF has illuminated the path toward a brighter future for
                countless Afghan girls. As fellow Afghans and an organization
                aligned with their mission and vision, we extend our heartfelt
                gratitude for their continued support and belief in our work.
              </blockquote>
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal asChild>
            <div className="mt-12 flex justify-center">
              <a
                href="https://agfaf.org"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-primary text-primary-foreground hover:shadow-primary/25 inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg active:scale-[0.98]"
              >
                Visit AGFAF&apos;s Website
                <ExternalLink className="size-4 transition-transform duration-300 group-hover:translate-x-px group-hover:-translate-y-px" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
