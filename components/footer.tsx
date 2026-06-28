"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site";

import { Facebook, Instagram, LinkedIn } from "@/components/icons";

const quickLinks = [
  { label: "About", href: "/about-us" },
  { label: "Mentorship", href: "/mentorship" },
  { label: "HerVoice", href: "/hervoice" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Resources", href: "/resources" },
  { label: "AGFAF", href: "/afgaf" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/157naMfgkw",
    icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/_empowerher_org",
    icon: Instagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/empowerher-org/",
    icon: LinkedIn,
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

  if (hiddenPaths.some((p) => pathname === p || pathname.startsWith(p + "/")))
    return null;

  return (
    <footer className="border-border/30 border-t">
      <div className="container py-20 md:py-28">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex -translate-x-4 items-center justify-center gap-2"
            >
              <img
                src="https://empowerher-cdn.alisamadii.com/logo.png"
                alt="EmpowerHer"
                className="h-45 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground max-w-sm text-sm leading-[1.8]">
              We envision Afghan women as guiding lights in their communities,
              inspiring hope and progress while leading the way to a more
              equitable, inclusive, and sustainable society.
            </p>

            <p className="text-muted-foreground mt-6 text-sm">
              Email:{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-foreground transition-colors"
              >
                {siteConfig.email}
              </a>
            </p>

            <div className="mt-6 space-y-0.5">
              <p className="text-muted-foreground text-sm font-medium">
                EST. 2024
              </p>
              <p className="text-muted-foreground text-sm">
                United States of America
              </p>
            </div>
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
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/60 hover:text-foreground group inline-flex items-center gap-2.5 text-sm transition-colors"
                  >
                    <s.icon className="size-4" />
                    {s.label}
                    <ArrowUpRight className="size-3 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
              ))}
            </ul>

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
              href="/privacy"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
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
