"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

import { siteConfig } from "@/lib/site";

/* ─── Form state ─────────────────────────────────────────────────────────────── */

type FormState = {
  firstName: string;
  lastName: string;
  businessEmail: string;
  position: string;
  organization: string;
  message: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  businessEmail: "",
  position: "",
  organization: "",
  message: "",
};

/* ─── Partner form component ────────────────────────────────────────────────── */

const PartnerForm = ({
  form,
  errors,
  loading,
  onChange,
  onSubmit,
}: {
  form: FormState;
  errors: Partial<FormState>;
  loading: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  const inputClass = (field: keyof FormState) =>
    `w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 ${
      errors[field] ? "border-destructive/60" : "border-border/60"
    }`;

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="text-foreground/80 text-sm font-medium"
          >
            First Name <span className="text-primary">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={form.firstName}
            onChange={onChange}
            placeholder="Nahid"
            className={inputClass("firstName")}
          />
          {errors.firstName && (
            <p className="text-destructive text-xs">{errors.firstName}</p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="lastName"
            className="text-foreground/80 text-sm font-medium"
          >
            Last Name <span className="text-primary">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={form.lastName}
            onChange={onChange}
            placeholder="Karimi"
            className={inputClass("lastName")}
          />
          {errors.lastName && (
            <p className="text-destructive text-xs">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="businessEmail"
          className="text-foreground/80 text-sm font-medium"
        >
          Business Email Address <span className="text-primary">*</span>
        </label>
        <input
          id="businessEmail"
          name="businessEmail"
          type="email"
          autoComplete="email"
          value={form.businessEmail}
          onChange={onChange}
          placeholder="you@organization.org"
          className={inputClass("businessEmail")}
        />
        {errors.businessEmail && (
          <p className="text-destructive text-xs">{errors.businessEmail}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="position"
            className="text-foreground/80 text-sm font-medium"
          >
            Your Position <span className="text-primary">*</span>
          </label>
          <input
            id="position"
            name="position"
            type="text"
            value={form.position}
            onChange={onChange}
            placeholder="Executive Director"
            className={inputClass("position")}
          />
          {errors.position && (
            <p className="text-destructive text-xs">{errors.position}</p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="organization"
            className="text-foreground/80 text-sm font-medium"
          >
            Organization / Company <span className="text-primary">*</span>
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            value={form.organization}
            onChange={onChange}
            placeholder="Your Organization"
            className={inputClass("organization")}
          />
          {errors.organization && (
            <p className="text-destructive text-xs">{errors.organization}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-foreground/80 text-sm font-medium"
        >
          Message <span className="text-primary">*</span>
        </label>
        <p className="text-muted-foreground text-xs">
          Please tell us briefly about your company/organization and how your
          company/organization can join us as a partner and support us
        </p>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={onChange}
          placeholder="Tell us about your organization and how you'd like to partner with EmpowerHer..."
          className={`bg-background placeholder:text-muted-foreground/40 focus:border-primary/40 focus:ring-primary/10 w-full resize-none rounded-xl border px-4 py-3 text-sm transition-all duration-300 outline-none focus:ring-2 ${
            errors.message ? "border-destructive/60" : "border-border/60"
          }`}
        />
        {errors.message && (
          <p className="text-destructive text-xs">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group bg-primary text-primary-foreground hover:shadow-primary/25 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg active:scale-[0.98] disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Submit Partnership Inquiry
            <span className="bg-primary-foreground/15 flex size-6 items-center justify-center rounded-full transition-transform duration-500 group-hover:translate-x-0.5">
              <ArrowRight className="size-3.5" />
            </span>
          </>
        )}
      </button>
    </form>
  );
};

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default function PartnerWithUsPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
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
            Organizations and companies aligned with our mission and vision, or
            those interested in supporting our work, are encouraged to complete
            the form below. A member of our team will be in touch to explore
            potential partnership opportunities.
          </p>
        </div>

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
      </div>

      {/* ── Right panel — form ───────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col justify-center px-8 py-16 md:px-14 lg:px-16 lg:py-24">
        {submitted ? (
          <div className="mx-auto max-w-md text-center">
            <div className="border-primary/20 bg-primary/5 mx-auto mb-6 flex size-20 items-center justify-center rounded-full border">
              <CheckCircle className="text-primary size-10" />
            </div>
            <h2 className="font-serif text-3xl">Thank You for Reaching Out</h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              We&apos;ve received your partnership inquiry. A member of our team
              will be in touch shortly to explore how we can work together.
            </p>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-lg">
            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
              Partnership Inquiry
            </p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl">
              Tell us about your organization
            </h2>
            <p className="text-muted-foreground mt-3 text-sm">
              All fields marked with <span className="text-primary">*</span> are
              required.
            </p>

            <div className="mt-10">
              <PartnerForm
                form={form}
                errors={errors}
                loading={loading}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
