"use client";

import { useState } from "react";
import { useTRPC } from "@/services/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowUpRight, Check, Mail, MapPin, Send } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(1, "Subject is required").max(500),
  phone: z.string().max(20).optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be under 5000 characters"),
});

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/share/157naMfgkw" },
  { label: "Instagram", href: "https://www.instagram.com/_empowerher_org" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/empowerher-org/",
  },
];

export const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const trpc = useTRPC();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      phone: "",
      message: "",
    },
  });

  const submit = useMutation(trpc.contact.send.mutationOptions());

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    submit.mutate(values, {
      onSuccess: () => {
        setSubmitted(true);
        toast.success("Message sent successfully!");
      },
      onError: (error) => {
        toast.error(error.message || "Something went wrong. Please try again.");
      },
    });
  };

  return (
    <section className="py-28 md:py-40">
      <div className="container">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left — Contact Info */}
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
              Contact
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
              Get in Touch
            </h1>
            <p className="text-muted-foreground mt-6 max-w-md text-base leading-[1.8]">
              Have a question or want to get involved? Fill out the form and
              we&apos;ll get back to you as soon as possible.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-full">
                  <Mail className="text-primary size-4" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                    Email
                  </p>
                  <a
                    href="mailto:info@empowerher-initiative.org"
                    className="text-foreground hover:text-primary mt-1 text-sm transition-colors"
                  >
                    info@empowerher-initiative.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-full">
                  <MapPin className="text-primary size-4" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                    Location
                  </p>
                  <p className="text-foreground mt-1 text-sm">
                    United States of America
                  </p>
                </div>
              </div>
            </div>

            <div className="border-border/30 mt-12 border-t pt-8">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                Follow Us
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/60 hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
                  >
                    {s.label}
                    <ArrowUpRight className="size-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div>
            {submitted ? (
              <div className="border-border/30 flex h-full flex-col items-center justify-center space-y-6 rounded-3xl border p-12 text-center">
                <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
                  <Check className="text-primary size-7" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl">Message Sent</h2>
                  <p className="text-muted-foreground text-sm">
                    Thank you for reaching out. We&apos;ll get back to you soon.
                  </p>
                </div>
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
                  name="subject"
                  render={({ field, fieldState }) => (
                    <Field aria-invalid={fieldState.invalid}>
                      <FieldLabel>Subject</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="What is this about?"
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
      </div>
    </section>
  );
};
