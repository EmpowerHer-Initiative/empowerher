"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "./icons/logo";
import { Cta } from "./landing-page/cta";

export const Footer = () => {
  const pathname = usePathname();

  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/reset-password" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/ui")
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
                links: ["Features", "Pricing", "Changelog", "Docs"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="mb-3 text-sm font-semibold">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link
                        href={`/${link.toLowerCase()}`}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-border/40 text-muted-foreground mt-10 border-t pt-6 text-center text-sm">
            © {new Date().getFullYear()} Brand. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};
