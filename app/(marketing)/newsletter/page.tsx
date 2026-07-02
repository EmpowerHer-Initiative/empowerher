"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useTRPC } from "@/services/trpc/client";

import { Reveal } from "@/components/reveal";

const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function NewsletterPage() {
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
    <section className="py-28 md:py-40">
      <div className="container">
        <div className="border-border/50 mx-auto grid max-w-5xl overflow-hidden rounded-3xl border md:grid-cols-2">
          {/* Form column */}
          <Reveal asChild>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
                Stay Connected
              </p>
              <h1 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">
                Subscribe to Our Newsletter
              </h1>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                Get the latest updates on our programs, success stories, and
                opportunities to get involved.
              </p>

              <div className="mt-8">
                {isSubmitted ? (
                  <div className="border-primary/20 bg-primary/[0.04] rounded-2xl border p-8 text-center">
                    <CheckCircle className="text-primary mx-auto mb-4 size-14" />
                    <h3 className="text-foreground text-xl font-semibold">
                      Thank you for subscribing!
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      You will receive our newsletter updates soon.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    noValidate
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="newsletter-email"
                        className="text-foreground/80 text-sm font-medium"
                      >
                        Email Address
                      </label>
                      <input
                        id="newsletter-email"
                        type="email"
                        placeholder="Enter your email address"
                        disabled={form.formState.isSubmitting}
                        className="border-border bg-muted/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 mt-2 w-full rounded-xl border px-5 py-3.5 text-sm transition-all duration-300 outline-none disabled:opacity-60"
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
                      className="group bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:opacity-60"
                    >
                      <Send className="size-4" />
                      {form.formState.isSubmitting
                        ? "Subscribing…"
                        : "Subscribe"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </Reveal>

          {/* Image column */}
          <div className="relative order-first min-h-72 md:order-last">
            <img
              src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTfa0gFM3C8OG5vkbyTeNds9rYucAtpJg0PMV7"
              alt="Empowering women and girls worldwide"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Reveal asChild delay={120}>
              <div className="absolute right-6 bottom-6 left-6 text-white">
                <h3 className="mb-2 font-serif text-2xl">Together We Rise</h3>
                <p className="text-sm leading-relaxed text-white/85">
                  Join supporters who are making a difference in the lives of
                  Afghan girls and women around the world.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
