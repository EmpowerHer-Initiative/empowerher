import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";
import { caller } from "@/services/trpc/server";

import { FooterNote } from "@/components/marketing/resources/footer-note";
import { Header } from "@/components/marketing/resources/header";

import { ResourceList } from "./resources-list";

export const metadata: Metadata = {
  title: `${siteConfig.pages.resources.title} — ${siteConfig.name}`,
  description: siteConfig.pages.resources.description,
};

export default async function ResourcesPage() {
  const resources = await caller.resources.list();

  return (
    <>
      <Header />
      <ResourceList resources={resources} />
      <FooterNote />
    </>
  );
}
