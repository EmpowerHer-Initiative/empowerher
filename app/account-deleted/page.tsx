import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

import { AccountDeletedContent } from "./account-deleted-content";

export const metadata: Metadata = {
  title: siteConfig.pages.accountDeleted.title,
};

export default function AccountDeletedPage() {
  return <AccountDeletedContent />;
}
