"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";

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
  "/account-deleted",
];

export const Footer = () => {
  const pathname = usePathname();

  if (hiddenPaths.some((p) => pathname === p || pathname.startsWith(p + "/")))
    return null;

  return (
    <footer className="border-border/30 border-t">
      <div className="container py-20 md:py-28">
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row">
          {/* Left: Brand */}
          <div className="flex flex-col">
            <Link href="/" className="inline-flex">
              <img
                src="https://cdn.empowerher-initiative.org/logo.png"
                alt="EmpowerHer"
                className="w-40 -translate-x-6 object-contain md:w-54"
              />
            </Link>
            <p className="text-muted-foreground max-w-sm text-sm leading-[1.8]">
              We envision Afghan women as guiding lights in their communities,
              inspiring hope and progress while leading the way to a more
              equitable, inclusive, and sustainable society.
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-foreground/70 hover:text-foreground mt-4 text-sm transition-colors"
            >
              Email: {siteConfig.email}
            </a>
            <p className="text-muted-foreground mt-4 text-sm font-medium">
              EST. 2024
            </p>
            <p className="text-muted-foreground text-sm">
              United States of America
            </p>
          </div>

          {/* Right: Pages + Follow Us */}
          <div className="flex flex-col items-start gap-12 sm:flex-row sm:gap-20">
            {/* Pages */}
            <div>
              <p className="mb-4 text-lg font-bold">Pages</p>
              <ul className="space-y-2">
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

            {/* Follow Us */}
            <div className="flex flex-col items-start">
              <p className="mb-4 text-lg font-bold">Follow Us</p>
              <div className="flex gap-4">
                {socialLinks.map((s) => (
                  <a
                    href={s.href}
                    key={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-foreground/70 hover:text-foreground transition-colors"
                  >
                    <s.icon className="size-6" />
                  </a>
                ))}
              </div>

              <Link
                href="/annual-report"
                className="bg-secondary text-secondary-foreground mt-5 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium duration-300 will-change-transform hover:scale-105 active:scale-95"
              >
                <FileText className="mr-2 size-4" />
                Annual Impact Report
              </Link>
            </div>
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
