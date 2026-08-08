"use client";

import Link from "next/link";
import { ArrowRight, Mail, ShieldAlert, UserCog, Users } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

import { LogoutButton } from "@/components/logout-button";
import { buttonVariants } from "@/components/ui/button";

type Area = "admin" | "staff";

/**
 * Role-aware "you can't see this" screen. Instead of a bare 404, it explains
 * who this area is for and points the user to where they *can* go.
 */
export function AccessDenied({
  area,
  role,
}: {
  area: Area;
  role?: string | null;
}) {
  const title =
    area === "admin" ? "Administrator access only" : "Team access only";

  const rows: {
    key: string;
    icon: React.ReactNode;
    label: string;
    text: string;
    active: boolean;
    href?: string;
    linkLabel?: string;
  }[] = [
    {
      key: "admin",
      icon: <UserCog className="size-5" />,
      label: "Administrators",
      text: "Full access to this dashboard — nothing more to do here.",
      active: role === "admin",
    },
    {
      key: "staff",
      icon: <Users className="size-5" />,
      label: "Staff members",
      text:
        area === "admin"
          ? "This is the admin dashboard. Manage your students and workshops in the Staff Area instead."
          : "Manage your students and workshops in the Staff Area.",
      active: role === "staff",
      href: "/staff",
      linkLabel: "Go to the Staff Area",
    },
    {
      key: "other",
      icon: <Mail className="size-5" />,
      label: "Everyone else",
      text: "If you believe you should have access, let us know and we'll get it sorted.",
      active: role !== "admin" && role !== "staff",
    },
  ];

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg text-center">
        <div className="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl">
          <ShieldAlert className="size-7" />
        </div>

        <h1 className="mt-6 font-serif text-3xl md:text-4xl">{title}</h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md text-base leading-relaxed">
          You&apos;re signed in, but this area isn&apos;t available for your
          account. Here&apos;s who it&apos;s for:
        </p>

        <p className="text-muted-foreground/80 mx-auto mt-3 max-w-md text-sm leading-relaxed">
          If your access was just changed, log out and back in — your account can
          take up to a minute to reflect the latest permissions.
        </p>

        <div className="mt-8 space-y-3 text-left">
          {rows.map((row) => (
            <div
              key={row.key}
              className={cn(
                "flex items-start gap-4 rounded-2xl border p-4 transition-colors",
                row.active
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/50"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 shrink-0",
                  row.active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {row.icon}
              </div>
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold">
                  {row.label}
                  {row.active && (
                    <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase">
                      You
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {row.text}
                </p>
                {row.href && (
                  <Link
                    href={row.href}
                    className="text-primary mt-2 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    {row.linkLabel}
                    <ArrowRight className="size-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {role === "staff" && area === "admin" && (
            <Link href="/staff" className={buttonVariants()}>
              Go to Staff Area
              <ArrowRight className="size-4" />
            </Link>
          )}
          <a
            href={`mailto:${siteConfig.email}`}
            className={buttonVariants({
              variant: role === "staff" ? "outline" : "default",
            })}
          >
            <Mail className="size-4" />
            Contact us
          </a>
          <LogoutButton variant="ghost" />
        </div>
      </div>
    </div>
  );
}
