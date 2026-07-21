"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";

import { Reveal } from "@/components/reveal";

const mediaFeatures = [
  {
    youtubeId: "l5YSKsYqbfY",
    label: "Podcast",
    title: "Interview with EmpowerHer Co-Founders",
    description:
      "Our co-founders, Nahid Karimi and Mahdi Rahimi, joined the NSHSS Scholars Connect Podcast to share their personal journeys from Afghanistan to the United States and the experiences that inspired them to launch EmpowerHer. In this episode, they discuss the challenges facing Afghan girls under Taliban rule, the role of education and mentorship in creating opportunity, and how young people can transform adversity into meaningful impact and leadership.",
  },
];

export const MediaSpotlight = () => {
  const [idx, setIdx] = useState(0);
  const total = mediaFeatures.length;
  const next = () => setIdx((i) => (i + 1) % total);
  const prev = () => setIdx((i) => (i - 1 + total) % total);

  return (
    <section className="py-28 md:py-40">
      <div className="container">
        <Reveal asChild>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
                Watch &amp; Listen
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">
                Featured Media
              </h2>
            </div>
            {total > 1 && (
              <div className="hidden items-center gap-3 md:flex">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous"
                  className="border-border/60 text-foreground/70 hover:border-primary hover:text-foreground flex size-12 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-95"
                >
                  <ArrowLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next"
                  className="border-border/60 text-foreground/70 hover:border-primary hover:text-foreground flex size-12 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-95"
                >
                  <ArrowRight className="size-5" />
                </button>
              </div>
            )}
          </div>
        </Reveal>

        {/* Carousel viewport */}
        <Reveal asChild delay={120}>
          <div className="relative mt-12 overflow-hidden rounded-[2.5rem]">
            <div
              className="flex transition-transform duration-[800ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{ transform: `translateX(-${idx * 100}%)` }}
            >
              {mediaFeatures.map((m) => (
                <div key={m.youtubeId} className="w-full shrink-0">
                  <div className="bg-muted/30 grid gap-0 lg:grid-cols-2">
                    <div className="relative aspect-video lg:aspect-auto lg:min-h-[440px]">
                      <iframe
                        src={`https://www.youtube.com/embed/${m.youtubeId}`}
                        title={m.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-8 md:p-14">
                      <div className="text-primary flex items-center gap-2">
                        <Play className="size-4 fill-current" />
                        <span className="text-xs font-medium tracking-[0.2em] uppercase">
                          {m.label}
                        </span>
                      </div>
                      <h3 className="mt-4 font-serif text-2xl leading-tight md:text-3xl">
                        {m.title}
                      </h3>
                      <p className="text-muted-foreground mt-5 text-base leading-[1.8]">
                        {m.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Click the right side to advance */}
            {total > 1 && (
              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="group absolute inset-y-0 right-0 flex w-16 items-center justify-center md:w-24"
              >
                <span className="bg-background/80 text-foreground flex size-12 items-center justify-center rounded-full shadow-lg backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:scale-110">
                  <ArrowRight className="size-5" />
                </span>
              </button>
            )}
          </div>
        </Reveal>

        {/* Dots */}
        {total > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {mediaFeatures.map((m, i) => (
              <button
                key={m.youtubeId}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === idx ? "bg-primary w-8" : "bg-border w-2.5"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
