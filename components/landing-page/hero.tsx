"use client"

import { ChevronRight } from "lucide-react"
import { BgPattern } from "../bg-pattern"
import { Button } from "../ui/button"
import Balancer from "react-wrap-balancer"

export const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      <BgPattern />
      <section className="container grid min-h-dvh px-0 md:grid-cols-2 md:gap-9">
        <div className="relative flex flex-col items-start justify-center gap-4 px-4 py-20">
          <div className="mx-auto flex max-w-xl flex-col gap-4">
            <h1 className="motion-animate text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              <Balancer>Build something extraordinary today</Balancer>
            </h1>
            <p className="motion-animate text-lg text-muted-foreground motion-delay-100 md:text-xl">
              <Balancer>
                The all-in-one platform that helps you create, launch, and scale
                your ideas faster than ever before. No complexity, just results.
              </Balancer>
            </p>
            <div className="motion-animate mt-4 flex w-full flex-col gap-2 motion-delay-200 md:flex-row">
              <Button size="lg" className="w-full justify-between md:w-64">
                Get Started <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
        <div className="relative isolate flex min-h-96 items-center justify-center py-8">
          <div className="relative aspect-video w-full shrink-0 origin-left translate-x-[30%] motion-scale-in-150 motion-blur-in-sm motion-opacity-in-0 overflow-hidden rounded-3xl motion-delay-400 md:w-[200%]">
            <img
              src="https://cdn.dribbble.com/userupload/12625976/file/original-477795e34939330965e12002052dcb49.jpg?resize=1024x768&vertical=center"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="absolute inset-0 -z-10 w-screen bg-primary"></div>
        </div>
      </section>
    </div>
  )
}
