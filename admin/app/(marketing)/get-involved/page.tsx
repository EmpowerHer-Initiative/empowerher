import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import { SplitScreen } from "@/components/marketing/get-involved/split-screen";

export const metadata: Metadata = {
  title: `${siteConfig.pages.getInvolved.title} — ${siteConfig.name}`,
  description: siteConfig.pages.getInvolved.description,
};

export default function GetInvolvedPage() {
  return (
    <>
      <SplitScreen />
    </>
  );
}
