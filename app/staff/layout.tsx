import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import { auth } from "@/services/auth/auth";

import { NavbarStaff } from "@/components/staff/navbar-staff";
import { PeriodProvider } from "@/components/staff/period-context";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  if (user.user.role !== "admin" && user.user.role !== "staff") {
    notFound();
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-12 pb-48",
        "[&_h1]:text-foreground [&_h1]:mb-8 [&_h1]:text-4xl [&_h1]:font-bold"
      )}
    >
      <PeriodProvider>
        <NavbarStaff />
        {children}
      </PeriodProvider>
    </div>
  );
}
