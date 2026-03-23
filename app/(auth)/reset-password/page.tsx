import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: siteConfig.pages.resetPassword.title,
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
