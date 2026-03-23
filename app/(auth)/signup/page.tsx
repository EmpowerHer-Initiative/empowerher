import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: siteConfig.pages.signup.title,
};

export default function SignupPage() {
  return <SignupForm />;
}
