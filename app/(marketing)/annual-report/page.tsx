import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import { Header } from "@/components/marketing/annual-report/header";
import { ReportCard } from "@/components/marketing/annual-report/report-card";

export const metadata: Metadata = {
  title: `${siteConfig.pages.annualReport.title} — ${siteConfig.name}`,
  description: siteConfig.pages.annualReport.description,
};

export default function AnnualReportPage() {
  return (
    <>
      <Header />
      <ReportCard />
      {/* <Commitment /> */}
    </>
  );
}
