"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, Mail, MapPin, Send } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useTRPC } from "@/services/trpc/client";

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
import { Reveal } from "@/components/reveal";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.email("Please enter a valid email"),
  subject: z.string().min(1, "Subject is required").max(500),
  phone: z.string().max(20).optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be under 5000 characters"),
});

const Facebook = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
  </svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

const Instagram = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.35 2.67.94 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.8.72 1.47 1.38 2.13.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.8-.3 1.47-.72 2.13-1.38.66-.66 1.08-1.33 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.8-.72-1.47-1.38-2.13A5.89 5.89 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
  </svg>
);

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/157naMfgkw",
    icon: Facebook,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/empowerher-org/",
    icon: Linkedin,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/_empowerher_org",
    icon: Instagram,
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
        console.log(error);
        toast.error(error.message || "Something went wrong. Please try again.");
      },
    });
  };

  return (
    <section className="py-28 md:py-40">
      <div className="container">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left — Contact Info */}
          <Reveal asChild>
            <div>
              <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
                Contact
              </p>
              <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
                Get in Touch
              </h1>
              <p className="text-muted-foreground mt-6 max-w-md text-base leading-[1.8]">
                Have a question about EmpowerHer or any of our programs? Fill
                out the form and we&apos;ll get back to you as soon as possible.
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
                <div className="mt-4 flex items-center gap-3">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="border-border/60 text-foreground/70 hover:border-primary hover:bg-primary hover:text-primary-foreground flex size-11 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5"
                    >
                      <s.icon className="size-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right — Form */}
          <Reveal asChild delay={120}>
            <div>
              {submitted ? (
                <div className="border-border/30 flex h-full flex-col items-center justify-center space-y-6 rounded-3xl border p-12 text-center">
                  <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
                    <Check className="text-primary size-7" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl">Message Sent</h2>
                    <p className="text-muted-foreground text-sm">
                      Thank you for reaching out. We&apos;ll get back to you
                      soon.
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
          </Reveal>
        </div>
      </div>
    </section>
  );
};
