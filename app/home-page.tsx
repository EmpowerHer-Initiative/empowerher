"use client";

import { Blog } from "@/components/landing-page/blog";
import { Features } from "@/components/landing-page/features";
import { Hero } from "@/components/landing-page/hero";
import { Pricing } from "@/components/landing-page/pricing";
import { Results } from "@/components/landing-page/results";
import { Testimonials } from "@/components/landing-page/testimonials";
import { Trust } from "@/components/landing-page/trust";

export const HomePage = () => {
  return (
    <>
      <Hero />
      <Results />
      <div className="my-24 space-y-24">
        <Trust />
        <Features />
        <Testimonials />
        <Pricing />
        <Blog />
      </div>
    </>
  );
};
