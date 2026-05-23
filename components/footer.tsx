"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail } from "lucide-react";

import { siteConfig } from "@/lib/site";

import { Logo } from "@/components/icons/logo";

const quickLinks = [
  { label: "About", href: "/about-us" },
  { label: "Mentorship", href: "/mentorship" },
  { label: "HerVoice", href: "/hervoice" },
  { label: "Stories", href: "/success-stories" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/share/157naMfgkw" },
  { label: "Instagram", href: "https://www.instagram.com/_empowerher_org" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/empowerher-org/",
  },
];

const hiddenPaths = [
  "/login",
  "/signup",
  "/reset-password",
  "/admin",
  "/settings",
  "/checkout",
  "/success",
  "/account-deleted",
];

export const Footer = () => {
  const pathname = usePathname();

  if (hiddenPaths.some((p) => pathname.startsWith(p))) return null;

  return (
    <footer className="border-border/30 border-t">
      <div className="container py-20 md:py-28">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <Logo className="size-7" />
              <span className="font-serif text-xl">EmpowerHer</span>
            </Link>
            <p className="text-muted-foreground mt-6 max-w-sm text-sm leading-[1.8]">
              We envision Afghan women as guiding lights in their communities,
              inspiring hope and progress while leading the way to a more
              equitable, inclusive, and sustainable society.
            </p>
          </div>

          {/* Pages */}
          <div className="lg:col-span-3">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
              Pages
            </p>
            <ul className="mt-6 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground/60 hover:text-foreground text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social */}
          <div className="lg:col-span-4">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
              Connect
            </p>
            <ul className="mt-6 space-y-3">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-foreground/60 hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
                >
                  <Mail className="size-3.5" />
                  {siteConfig.email}
                </a>
              </li>
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/60 hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
                  >
                    {s.label}
                    <ArrowUpRight className="size-3" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-2">
              <p className="text-muted-foreground text-xs">Est. 2024</p>
              <p className="text-muted-foreground text-xs">
                United States of America
              </p>
            </div>

            <Link
              href="/annual-report"
              className="text-primary hover:text-primary/80 mt-6 inline-flex items-center gap-2 text-xs font-medium transition-colors"
            >
              Annual Impact Report &rarr;
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-border/20 mt-20 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} {siteConfig.companyName}. All
            rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/legal/privacy"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
