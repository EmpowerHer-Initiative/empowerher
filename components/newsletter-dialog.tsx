"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Send, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/services/trpc/client";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export const NewsletterDialog = () => {
  const [isOpen, setIsOpen] = useState(true);
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
      setTimeout(() => setIsOpen(false), 2000);
    } catch (error) {
      form.setError("email", {
        message:
          error instanceof Error
            ? error.message
            : "Failed to subscribe to newsletter",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "bg-background shadow-300 fixed right-4 bottom-4 z-50 w-full max-w-md rounded-xl border p-6 backdrop-blur-sm transition-all duration-300",
        "motion-opacity-in-0 motion-translate-y-in-[100px] motion-blur-in-[4px] motion-delay-2000"
      )}
    >
      <button
        onClick={() => setIsOpen(false)}
        className="text-muted-foreground hover:text-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </button>

      {isSubmitted ? (
        <div className="py-4 text-center">
          <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            Thank you for subscribing!
          </h3>
          <p className="text-muted-foreground text-sm">
            You will receive our newsletter updates soon.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.empowerher-initiative.org/logo.png"
              alt={siteConfig.name}
              className="size-12 object-contain"
            />
            <div className="flex-1">
              <h3 className="text-foreground text-lg font-semibold">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-muted-foreground text-xs">
                Get the latest updates on our programs and success stories.
              </p>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldContent>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      type="email"
                      placeholder="Enter your email"
                      size="lg"
                      className="w-full"
                    />
                  </FieldContent>
                  <FieldError
                    errors={fieldState.error ? [fieldState.error] : undefined}
                  />
                </Field>
              )}
            />
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Spinner />
              ) : (
                <>
                  <Send className="mr-2 size-4" />
                  Subscribe
                </>
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
