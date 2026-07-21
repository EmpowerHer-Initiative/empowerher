"use client";

import { ArrowRight, Loader2 } from "lucide-react";

export type FormState = {
  firstName: string;
  lastName: string;
  businessEmail: string;
  position: string;
  organization: string;
  message: string;
};

export const initialState: FormState = {
  firstName: "",
  lastName: "",
  businessEmail: "",
  position: "",
  organization: "",
  message: "",
};

export const PartnerForm = ({
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
