"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  const images = [
    "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTN5bpAvcOGaUAyKX1dPWs9RnojYZeu4JbiQHv",
    "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTvX8bHR050TX8DRt9gfxu6sU74iOHozSwBKGJ",
    "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTfCWhJzn3C8OG5vkbyTeNds9rYucAtpJg0PMV",
    "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTQRqW7Y9a2imSKVTAuXrJU9NxI0LRsOFlgdvw",
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      {/* Full-bleed background image */}
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1.8s] ease-[cubic-bezier(0.32,0.72,0,1)] ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />

      {/* Content overlay */}
      <div className="relative container flex min-h-[100dvh] items-end pt-40 pb-20 md:items-center md:pb-0">
        <div className="max-w-5xl">
          <h1 className="font-serif text-4xl leading-[1.08] text-white md:text-6xl lg:text-8xl">
            Empowering Dreams,
            <br />
            <span className="text-[var(--primary)] italic">
              Inspiring Futures
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            At EmpowerHer, we believe every Afghan girl and woman has a story
            worth telling and a future worth fighting for. Through mentorship
            programs and publication opportunities, we help them find the tools,
            confidence, and platforms they need to raise their voices and become
            changemakers in their communities and beyond.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/about-us"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/90 active:scale-[0.98]"
            >
              About Us
              <span className="flex size-7 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          </div>

          {/* Dots */}
          <div className="mt-12 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-[3px] rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  i === idx ? "w-10 bg-white" : "w-4 bg-white/30"
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
