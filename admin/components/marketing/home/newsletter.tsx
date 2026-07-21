"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useTRPC } from "@/services/trpc/client";

import { Reveal } from "@/components/reveal";

const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export const Newsletter = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const trpc = useTRPC();
  const subscribe = useMutation(trpc.newsletter.subscribe.mutationOptions());

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      const result = await subscribe.mutateAsync({ email: data.email });

      if (result.alreadySubscribed) {
        form.setError("email", {
          message: "You are already subscribed to the newsletter",
        });
        return;
      }

      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      form.setError("email", {
        message:
          error instanceof Error
            ? error.message
            : "Failed to subscribe to newsletter",
      });
    }
  };

  return (
    <section className="bg-muted text-foreground relative overflow-hidden py-28 md:py-40">
      {/* Decorative elements */}
      <div className="bg-primary/[0.08] pointer-events-none absolute -top-32 -left-32 size-96 rounded-full blur-3xl" />
      <div className="bg-secondary/[0.08] pointer-events-none absolute -right-24 -bottom-24 size-80 rounded-full blur-3xl" />
      <div className="border-foreground/[0.04] pointer-events-none absolute top-1/2 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border" />
      <div className="border-foreground/[0.04] pointer-events-none absolute top-1/2 left-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border" />

      <div className="relative container">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left — messaging */}
          <Reveal asChild>
            <div>
              <div className="border-border bg-card inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
                <Heart className="text-primary size-3.5" />
                <span className="text-muted-foreground text-[10px] font-semibold tracking-[0.2em] uppercase">
                  Stay Connected
                </span>
              </div>
              <h2 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
                Join Our
                <br />
                <span className="text-primary italic">Community</span>
              </h2>
              <p className="text-muted-foreground mt-6 max-w-md text-base leading-[1.8]">
                Get updates on our programs, success stories, and ways to
                support Afghan girls&apos; education. Be part of a growing
                movement for change.
              </p>

              {/* <div className="mt-10 flex items-center gap-8">
            <div>
              <p className="text-primary font-serif text-3xl">9+</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Global Partners
              </p>
            </div>
            <div className="bg-border h-10 w-px" />
            <div>
              <p className="text-primary font-serif text-3xl">5</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Active Workshops
              </p>
            </div>
            <div className="bg-border h-10 w-px" />
            <div>
              <p className="text-primary font-serif text-3xl">100%</p>
              <p className="text-muted-foreground mt-1 text-xs">Free Programs</p>
            </div>
          </div> */}
            </div>
          </Reveal>

          {/* Right — form card */}
          <Reveal asChild delay={120}>
            <div className="border-border bg-card rounded-3xl border p-8 shadow-sm md:p-10">
              <h3 className="font-serif text-2xl">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                Join hundreds of supporters and community members.
              </p>
              {isSubmitted ? (
                <div className="border-primary/20 bg-primary/[0.06] mt-8 rounded-xl border px-5 py-6 text-center">
                  <p className="text-foreground text-sm font-semibold">
                    Thanks for subscribing!
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    You&apos;re now part of our community.
                  </p>
                </div>
              ) : (
                <form
                  className="mt-8 space-y-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                  noValidate
                >
                  <div>
                    <input
                      type="email"
                      placeholder="Your email address"
                      disabled={form.formState.isSubmitting}
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/40 w-full rounded-xl border px-5 py-3.5 text-sm transition-all duration-300 outline-none disabled:opacity-60"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-destructive mt-2 text-xs">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:opacity-60"
                  >
                    {form.formState.isSubmitting ? "Subscribing…" : "Subscribe"}
                  </button>
                </form>
              )}
              <p className="text-muted-foreground mt-4 text-center text-xs">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
