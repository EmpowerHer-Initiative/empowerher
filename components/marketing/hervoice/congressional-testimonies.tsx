import { Reveal } from "@/components/reveal";

export const CongressionalTestimonies = () => (
  <section className="bg-muted text-foreground py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-4xl">
        <Reveal asChild>
          <p className="text-muted-foreground mb-8 text-xs font-semibold tracking-[0.3em] uppercase">
            Amplifying Voices
          </p>
        </Reveal>
        <Reveal asChild delay={80}>
          <h2 className="text-foreground font-serif text-4xl leading-[1.1] md:text-5xl">
            Congressional Testimonies
          </h2>
        </Reveal>

        <Reveal asChild delay={160}>
          <p className="text-muted-foreground mt-8 max-w-2xl text-base leading-relaxed">
            These two congressional testimonies were shared for publication by
            the Afghan Scouts Relief Fund (ASRF) with the EmpowerHer HerVoice
            Initiative.
          </p>
        </Reveal>

        {/* Centered blockquote */}
        <Reveal asChild>
          <div className="border-border my-16 border-l-2 pl-8">
            <p className="text-muted-foreground font-serif text-xl leading-relaxed md:text-2xl">
              &ldquo;These testimonies are representative of the passion of so
              many Afghan women to share their powerful experiences and their
              drive to become their best selves and contribute in their own
              unique ways to society. By sharing the obstacles they have
              overcome and their amazing pursuits, they serve as an inspiration
              to many of their peers who want to navigate their own path to
              success.&rdquo;
            </p>
            <p className="text-muted-foreground mt-6 text-xs font-semibold tracking-[0.3em] uppercase">
              — Afghan Scouts Relief Fund (ASRF)
            </p>
          </div>
        </Reveal>

        <Reveal asChild delay={80}>
          <p className="text-muted-foreground mb-10 text-sm">
            Coming from a country where their very existence is dehumanized, and
            their human rights are not recognized, their resilience in the face
            of adversity should be a message to the whole world that we must
            support the future of Afghan women in every possible way.
          </p>
        </Reveal>

        {/* Videos */}
        <Reveal asChild delay={160}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl">
              <video
                controls
                poster="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT4ggEVZxLP0HVtXjpzDWZR85f7vGSgA1FduQY"
                className="w-full"
              >
                <source
                  src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTFAaVBPi81Sgch3ByG9m45xzoRfbnkKwIXpZO"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <p className="text-muted-foreground mt-3 text-xs font-semibold tracking-[0.2em] uppercase">
                Congressional Testimony — Part 1
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl">
              <video
                controls
                poster="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTawihdJkAtfy8gUMVlFj5QpoO3BkxsndH9Dm2"
                className="w-full"
              >
                <source
                  src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT1BPtxl2QzEuUaBX9YLlpwGm6Z8oisI4dSv7k"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <p className="text-muted-foreground mt-3 text-xs font-semibold tracking-[0.2em] uppercase">
                Congressional Testimony — Part 2
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
