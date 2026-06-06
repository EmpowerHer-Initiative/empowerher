import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { cn } from "@/lib/utils";

import { NavbarAdmin } from "@/components/admin/navbar-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth } = await import("@/services/auth/auth");
  const user = await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  if (user.user.role !== "admin") {
    notFound();
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-12 pb-48",
        "[&_h1]:text-foreground [&_h1]:mb-8 [&_h1]:text-4xl [&_h1]:font-bold"
      )}
    >
      <NavbarAdmin />
      {children}
    </div>
  );
}
