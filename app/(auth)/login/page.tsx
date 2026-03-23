import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: siteConfig.pages.login.title,
};

export default function LoginPage() {
  return <LoginForm />;
}
