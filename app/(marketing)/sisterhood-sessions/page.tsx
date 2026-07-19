import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import { Community } from "@/components/marketing/sisterhood-sessions/community";
import { Header } from "@/components/marketing/sisterhood-sessions/header";
import { SessionFormat } from "@/components/marketing/sisterhood-sessions/session-format";
import { WhyTheyMatter } from "@/components/marketing/sisterhood-sessions/why-they-matter";

export const metadata: Metadata = {
  title: `${siteConfig.pages.sisterhoodSessions.title} — ${siteConfig.name}`,
  description: siteConfig.pages.sisterhoodSessions.description,
};

export default function SisterhoodSessionsPage() {
  return (
    <>
      <Header />
      <WhyTheyMatter />
      <Community />
      <SessionFormat />
    </>
  );
}
