"use client";

import { ChevronRight, Star } from "lucide-react";
import Balancer from "react-wrap-balancer";

import { BgPattern } from "../bg-pattern";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      <BgPattern />
      <section className="container grid min-h-[calc(100dvh-4rem)] px-0 md:grid-cols-2 md:gap-9">
        <div className="relative flex flex-col items-start justify-center gap-4 px-4 py-20">
          <div className="mx-auto flex max-w-xl grow flex-col gap-20">
            <div className="flex grow flex-col justify-center gap-4">
              <Badge
                variant="outline"
                className="motion-opacity-in-0 motion-delay-1000 mx-auto mb-8 px-4 py-4 text-base md:mx-0"
              >
                New Product Launch | Limited Time Offer <ChevronRight />
              </Badge>
              <h1 className="motion-animate text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                <Balancer>Build something extraordinary today</Balancer>
              </h1>
              <p className="motion-animate text-muted-foreground motion-delay-100 text-lg md:text-xl">
                <Balancer>
                  The all-in-one platform that helps you create, launch, and
                  scale your ideas faster than ever before. No complexity, just
                  results.
                </Balancer>
              </p>
              <div className="motion-animate motion-delay-200 mt-4 flex w-full flex-col gap-2 md:flex-row">
                <Button size="xl" className="w-full justify-between md:w-64">
                  Get Started <ChevronRight />
                </Button>
              </div>
            </div>

            <div className="motion-animate text-muted-foreground motion-delay-300 mt-auto space-y-4">
              <div className="flex items-center gap-1">
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                <Star fill="currentColor" />
                4.9
              </div>
              <p>Trusted by 100,000+ users</p>
            </div>
          </div>
        </div>
        <div className="relative isolate flex min-h-96 items-center justify-center py-8">
          <div className="motion-scale-in-150 motion-blur-in-sm motion-opacity-in-0 motion-delay-400 relative aspect-video w-full shrink-0 origin-left translate-x-[30%] overflow-hidden rounded-3xl md:w-[200%]">
            <img
              src="https://cdn.dribbble.com/userupload/12625976/file/original-477795e34939330965e12002052dcb49.jpg?resize=1024x768&vertical=center"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="bg-primary absolute inset-0 -z-10 w-screen"></div>
        </div>
      </section>
    </div>
  );
};
