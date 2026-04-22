"use client";

import { useState } from "react";
import { useTRPC } from "@/services/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
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

  const submit = useMutation(trpc.contact.create.mutationOptions());

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
    <section className="container py-16 md:py-24">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 text-3xl font-bold">Contact</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Have a question? Fill out the form and we&apos;ll get back to you.
        </p>

        {submitted ? (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-semibold">Message Sent</h2>
            <p className="text-muted-foreground text-sm">
              Thank you for reaching out. We&apos;ll get back to you soon.
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                    errors={fieldState.error ? [fieldState.error] : undefined}
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
                    errors={fieldState.error ? [fieldState.error] : undefined}
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
                    errors={fieldState.error ? [fieldState.error] : undefined}
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
                    errors={fieldState.error ? [fieldState.error] : undefined}
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
                    errors={fieldState.error ? [fieldState.error] : undefined}
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
    </section>
  );
};
