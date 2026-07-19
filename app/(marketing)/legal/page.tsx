import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import { Hero } from "@/components/marketing/legal/hero";
import { LegalBody } from "@/components/marketing/legal/legal-body";

export const metadata: Metadata = {
  title: `Terms & Privacy — ${siteConfig.name}`,
  description:
    "The terms of use and privacy policy for the EmpowerHer Initiative.",
};

export default function LegalPage() {
  return (
    <main>
      <Hero />
      <LegalBody />
    </main>
  );
}
