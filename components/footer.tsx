"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/lib/site";

import { Logo } from "./icons/logo";
import { Cta } from "./landing-page/cta";

export const Footer = () => {
  const pathname = usePathname();

  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/reset-password" ||
    pathname === "/checkout" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/ui") ||
    pathname === "/success"
  ) {
    return null;
  }

  return (
    <>
      <Cta className="mt-20 mb-20 md:mt-30 md:-mb-30" />
      <footer className="dark border-border/40 bg-background/95 text-foreground dark:bg-muted rounded-t-3xl border-t pt-12 pb-12 md:rounded-t-[4rem] md:pt-48">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/">
                <Logo className="text-foreground size-10" />
              </Link>
              <p className="text-muted-foreground mt-2 text-sm">
                Building the future, one project at a time.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: [
                  { label: "Features", href: "/#features" },
                  { label: "Pricing", href: "/#pricing" },
                  { label: "Blog", href: "/blog" },
                ],
              },
              {
                title: "Company",
                links: [
                  { label: "Contact", href: "/contact" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { label: "Privacy", href: "/privacy" },
                  { label: "Terms", href: "/terms" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="mb-3 text-sm font-semibold">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-border/40 text-muted-foreground mt-10 border-t pt-6 text-center text-sm">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};
