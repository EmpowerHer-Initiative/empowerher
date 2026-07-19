"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

import { siteConfig } from "@/lib/site";

import {
  initialState,
  VolunteerForm,
  type FormState,
} from "@/components/marketing/volunteer-with-us/volunteer-form";
import { Reveal } from "@/components/reveal";

import { submitVolunteer } from "../actions";

export default function VolunteerWithUsPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState & { cv: string }>>({});
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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
    setSubmitError(null);
    if (!validate()) return;
    setLoading(true);

    const data = new FormData();
    data.append("firstName", form.firstName);
    data.append("lastName", form.lastName);
    data.append("email", form.email);
    data.append("message", form.message);
    if (cvFile) data.append("cv", cvFile);

    const result = await submitVolunteer(data);
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
                {submitError && (
                  <p className="text-destructive mt-4 text-sm">{submitError}</p>
                )}
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}
