import { notFound } from "next/navigation";

import { isFeatureEnabled } from "@/config/features";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isFeatureEnabled("auth")) notFound();

  return children;
}
