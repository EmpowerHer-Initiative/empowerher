"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import { siteConfig } from "@/lib/site";

import { Reveal } from "@/components/reveal";

/* ─── Form state ─────────────────────────────────────────────────────────────── */

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
};

/* ─── Volunteer form component ─────────────────────────────────────────────── */

const VolunteerForm = ({
  form,
  errors,
  cvFile,
  dragging,
  loading,
  fileInputRef,
  onChange,
  onFile,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveFile,
  onSubmit,
}: {
  form: FormState;
  errors: Partial<FormState & { cv: string }>;
  cvFile: File | null;
  dragging: boolean;
  loading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFile: (file: File | null) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onRemoveFile: (e: React.MouseEvent) => void;
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
            placeholder="Mariam"
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
            placeholder="Rahimi"
            className={inputClass("lastName")}
          />
          {errors.lastName && (
            <p className="text-destructive text-xs">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-foreground/80 text-sm font-medium"
        >
          Email Address <span className="text-primary">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={onChange}
          placeholder="you@example.com"
          className={inputClass("email")}
        />
        {errors.email && (
          <p className="text-destructive text-xs">{errors.email}</p>
        )}
      </div>

      {/* CV Upload */}
      <div className="space-y-2">
        <label className="text-foreground/80 text-sm font-medium">
          CV / Resume <span className="text-primary">*</span>{" "}
          <span className="text-muted-foreground">(PDF)</span>
        </label>
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 transition-all duration-300 ${
            dragging
              ? "border-primary/60 bg-primary/5"
              : cvFile
                ? "border-primary/30 bg-primary/[0.03]"
                : "border-border/60 bg-background hover:border-primary/30 hover:bg-primary/[0.02]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          {cvFile ? (
            <div className="flex w-full items-center gap-3">
              <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-full">
                <FileText className="text-primary size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{cvFile.name}</p>
                <p className="text-muted-foreground text-xs">
                  {(cvFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={onRemoveFile}
                className="bg-muted hover:bg-muted/80 flex size-7 shrink-0 items-center justify-center rounded-full transition-colors"
              >
                <X className="text-muted-foreground size-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="border-border/60 bg-muted/50 flex size-12 items-center justify-center rounded-full border">
                <Upload className="text-muted-foreground size-5" />
              </div>
              <div className="text-center">
                <p className="text-foreground/80 text-sm font-medium">
                  Drag &amp; drop your CV here
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  or click to browse — PDF only
                </p>
              </div>
            </>
          )}
        </div>
        {errors.cv && <p className="text-destructive text-xs">{errors.cv}</p>}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-foreground/80 text-sm font-medium"
        >
          Message <span className="text-primary">*</span>
        </label>
        <p className="text-muted-foreground text-xs">
          Please tell us briefly about yourself, why you would like to volunteer
          with EmpowerHer, and how you plan to help address the educational
          barriers faced by girls.
        </p>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={onChange}
          placeholder="Share your background, motivations, and what you'd like to contribute..."
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
        className="group bg-primary text-primary-foreground hover:shadow-primary/20 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg active:scale-[0.98] disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            Submit Volunteer Application
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

export default function VolunteerWithUsPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState & { cv: string }>>({});
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const next: Partial<FormState & { cv: string }> = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Please enter a valid email address";
    }
    if (!form.message.trim()) next.message = "Message is required";
    if (!cvFile) next.cv = "Resume is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      setCvFile(file);
      setErrors((prev) => ({ ...prev, cv: undefined }));
    } else {
      setErrors((prev) => ({ ...prev, cv: "Please upload a PDF file" }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCvFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
            src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTDe1RCWh0fiZ3z8JjCWsbc2laUL6tAeqPnMNS"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative">
          <Reveal>
            <Link
              href="/get-involved"
              className="group text-muted-foreground hover:text-foreground mb-12 inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Back
            </Link>
          </Reveal>

          <Reveal asChild delay={80}>
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
              Open to All
            </p>
          </Reveal>
          <Reveal asChild delay={160}>
            <h1 className="mt-4 font-serif text-4xl leading-[1.1] md:text-5xl">
              Volunteer With Us
            </h1>
          </Reveal>
          <Reveal asChild delay={240}>
            <p className="text-muted-foreground mt-6 text-base leading-relaxed">
              EmpowerHer welcomes volunteers from around the world to contribute
              to our virtual workshops and programs. Volunteers may support our
              community and staff in different ways, such as serving as
              lecturers, mentors, assistants, or administrative members, as
              positions become available. We encourage volunteers to share
              perspectives from their countries and backgrounds to foster
              meaningful cross-cultural learning. We value diverse voices
              committed to educating and empowering Afghan girls and youth.
            </p>
          </Reveal>

          <Reveal asChild delay={320}>
            <div className="border-border bg-foreground/5 mt-10 rounded-xl border p-5">
              <p className="text-muted-foreground text-xs">
                Afghan girls outside the Middle East and Central Asia are
                especially encouraged to volunteer with us.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal asChild>
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
          <div className="mx-auto max-w-md text-center">
            <Reveal asChild>
              <div className="border-primary/20 bg-primary/5 mx-auto mb-6 flex size-20 items-center justify-center rounded-full border">
                <CheckCircle className="text-primary size-10" />
              </div>
            </Reveal>
            <Reveal asChild delay={80}>
              <h2 className="font-serif text-3xl">Application Received</h2>
            </Reveal>
            <Reveal asChild delay={160}>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                Thank you for your interest in volunteering with EmpowerHer. Our
                team will review your application and reach out soon.
              </p>
            </Reveal>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-lg">
            <Reveal asChild>
              <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
                Volunteer Application
              </p>
            </Reveal>
            <Reveal asChild delay={80}>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl">
                Join our volunteer community
              </h2>
            </Reveal>
            <Reveal asChild delay={160}>
              <p className="text-muted-foreground mt-3 text-sm">
                Tell us about yourself and how you&apos;d like to contribute.
                All fields marked <span className="text-primary">*</span> are
                required.
              </p>
            </Reveal>

            <Reveal asChild delay={240}>
              <div className="mt-10">
                <VolunteerForm
                  form={form}
                  errors={errors}
                  cvFile={cvFile}
                  dragging={dragging}
                  loading={loading}
                  fileInputRef={fileInputRef}
                  onChange={handleChange}
                  onFile={handleFile}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onRemoveFile={handleRemoveFile}
                  onSubmit={handleSubmit}
                />
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}
