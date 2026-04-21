import { notFound } from "next/navigation";

import { isFeatureEnabled } from "@/config/features";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isFeatureEnabled("blog")) notFound();

  return children;
}
