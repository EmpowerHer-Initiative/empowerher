"use client";

import { ArrowRight, FileText, Loader2, Upload, X } from "lucide-react";

export type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

export const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
};

export const VolunteerForm = ({
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
