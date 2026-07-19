"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

import { siteConfig } from "@/lib/site";

import {
  initialState,
  PartnerForm,
  type FormState,
} from "@/components/marketing/partner-with-us/partner-form";
import { Reveal } from "@/components/reveal";

import { submitPartner } from "../actions";

export default function PartnerWithUsPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
    if (!form.businessEmail.trim()) {
      next.businessEmail = "Business email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.businessEmail)) {
      next.businessEmail = "Please enter a valid email address";
    }
    if (!form.position.trim()) next.position = "Position is required";
    if (!form.organization.trim())
      next.organization = "Organization is required";
    if (!form.message.trim()) next.message = "Message is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    setLoading(true);
    const result = await submitPartner({
      firstName: form.firstName,
      lastName: form.lastName,
      businessEmail: form.businessEmail,
      position: form.position,
      organization: form.organization,
      message: form.message,
    });
    setLoading(false);
    if ("error" in result) {
      setSubmitError(result.error);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen lg:flex">
      {/* ── Left panel — brand messaging ─────────────────────────────────────── */}
      <div className="bg-muted text-foreground relative flex flex-col justify-between overflow-hidden px-10 py-16 md:px-14 lg:w-[45%] lg:px-16 lg:py-24">
        {/* Background image subtle overlay */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT3hSLjjKpPsIbjXnuoAM3O2JygVY8KzGFtD6k"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <Reveal asChild>
          <div className="relative">
            <Link
              href="/get-involved"
              className="group text-muted-foreground hover:text-foreground mb-12 inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Back
            </Link>

            <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
              Organizations &amp; Companies
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.1] md:text-5xl">
              Partner With Us
            </h1>
            <p className="text-muted-foreground mt-6 text-base leading-relaxed">
              Organizations and companies aligned with our mission and vision,
              or those interested in supporting our work, are encouraged to
              complete the form below. A member of our team will be in touch to
              explore potential partnership opportunities.
            </p>
          </div>
        </Reveal>

        <Reveal asChild delay={120}>
          <div className="border-border relative mt-16 border-t pt-8">
            <p className="text-muted-foreground text-xs">
              Questions?{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-muted-foreground underline-offset-2 hover:underline"
              >
                {siteConfig.email}
              </a>
            </p>
          </div>
        </Reveal>
      </div>

      {/* ── Right panel — form ───────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col justify-center px-8 py-16 md:px-14 lg:px-16 lg:py-24">
        {submitted ? (
          <Reveal asChild>
            <div className="mx-auto max-w-md text-center">
              <div className="border-primary/20 bg-primary/5 mx-auto mb-6 flex size-20 items-center justify-center rounded-full border">
                <CheckCircle className="text-primary size-10" />
              </div>
              <h2 className="font-serif text-3xl">
                Thank You for Reaching Out
              </h2>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                We&apos;ve received your partnership inquiry. A member of our
                team will be in touch shortly to explore how we can work
                together.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal asChild>
            <div className="mx-auto w-full max-w-lg">
              <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
                Partnership Inquiry
              </p>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl">
                Tell us about your organization
              </h2>
              <p className="text-muted-foreground mt-3 text-sm">
                All fields marked with <span className="text-primary">*</span>{" "}
                are required.
              </p>

              <div className="mt-10">
                <PartnerForm
                  form={form}
                  errors={errors}
                  loading={loading}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                />
                {submitError && (
                  <p className="text-destructive mt-4 text-sm">{submitError}</p>
                )}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
