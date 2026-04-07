"use client";

import { useState } from "react";
import { useTRPC } from "@/services/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Mail, Send } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { siteConfig } from "@/lib/site";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().max(20).optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
});

export const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const trpc = useTRPC();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const submit = useMutation(trpc.contact.submit.mutationOptions());

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    submit.mutate(values, {
      onSuccess: () => {
        setSubmitted(true);
        toast.success("Message sent successfully!");
      },
      onError: (error) => {
        if (error.message.includes("Rate limit")) {
          toast.error("Too many messages. Please wait a minute and try again.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      },
    });
  };

  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:gap-16">
        {/* Left side */}
        <div className="flex flex-col justify-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Get in Touch
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md text-lg">
            Have a question, feedback, or just want to say hello? We&apos;d love
            to hear from you. Fill out the form and we&apos;ll get back to you
            as soon as possible.
          </p>
          <div className="text-muted-foreground flex items-center gap-3 text-sm">
            <Mail className="size-4" />
            <a
              href={`mailto:${siteConfig.email}`}
              className="hover:text-foreground transition-colors"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>

        {/* Right side — form or success */}
        <div className="bg-card rounded-2xl border p-8 shadow-sm">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-primary/10 mb-4 flex size-16 items-center justify-center rounded-full">
                <CheckCircle2 className="text-primary size-8" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold">Message Sent!</h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Thank you for reaching out. We&apos;ll review your message and
                get back to you soon.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  form.reset();
                }}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel>Name</FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Your name"
                        size="lg"
                      />
                    </FieldContent>
                    <FieldError
                      errors={
                        fieldState.error ? [fieldState.error] : undefined
                      }
                    />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="you@example.com"
                        type="email"
                        size="lg"
                      />
                    </FieldContent>
                    <FieldError
                      errors={
                        fieldState.error ? [fieldState.error] : undefined
                      }
                    />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Phone{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="+1 (555) 123-4567"
                        type="tel"
                        size="lg"
                      />
                    </FieldContent>
                    <FieldError
                      errors={
                        fieldState.error ? [fieldState.error] : undefined
                      }
                    />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="message"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel>Message</FieldLabel>
                    <FieldContent>
                      <Textarea
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Tell us what's on your mind..."
                        rows={5}
                      />
                    </FieldContent>
                    <FieldError
                      errors={
                        fieldState.error ? [fieldState.error] : undefined
                      }
                    />
                  </Field>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={submit.isPending}
              >
                {submit.isPending ? (
                  <Spinner />
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
