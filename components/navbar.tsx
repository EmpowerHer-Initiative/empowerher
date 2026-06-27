"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { Logo } from "@/components/icons/logo";

type NavItem = { label: string; href: string; children?: NavItem[] };

const programs: NavItem[] = [
  {
    label: "Mentorship Program",
    href: "/mentorship",
    children: [
      { label: "Monthly Internet Scholarship (MIS)", href: "/mis" },
      { label: "Student Project Roadmap", href: "/success-stories/spr" },
    ],
  },
  {
    label: "HerVoice",
    href: "/hervoice",
    children: [
      {
        label: "Featured Writings from Our Partners",
        href: "/hervoice/featured-writings-from-our-partners",
      },
    ],
  },
];

const successStories: NavItem[] = [
  { label: "All Success Stories", href: "/success-stories" },
  {
    label: "Sahar Education's Secret Scholars Online Platform (SSO)",
    href: "/sso",
  },
];

const navLinks: NavItem[] = [
  { label: "About", href: "/about-us" },
  { label: "Programs", href: "#", children: programs },
  { label: "Success Stories", href: "#", children: successStories },
  { label: "Resources", href: "/resources" },
  { label: "AFGAF", href: "/afgaf" },
  { label: "Contact", href: "/contact" },
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

export const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  if (hiddenPaths.some((p) => pathname === p || pathname.startsWith(p + "/")))
    return null;

  const isHome = pathname === "/";

  return (
    <>
      {/* Nav */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          scrolled
            ? "border-border/30 bg-background border-b shadow-sm backdrop-blur-2xl"
            : isHome
              ? "bg-transparent"
              : "bg-background"
        } ${isHome && !scrolled ? "-mb-16 lg:-mb-20" : ""}`}
      >
        <div className="container flex h-16 items-center justify-between lg:h-20">
          <Link
            href="/"
            className={`flex items-center gap-2 transition-colors duration-300 ${
              mobileOpen
                ? "text-primary"
                : scrolled
                  ? "text-primary"
                  : isHome
                    ? "text-white"
                    : "text-primary"
            }`}
          >
            <Logo className="size-12" />
            <span className="font-serif text-xl">EmpowerHer Initiative</span>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() =>
                  link.children && setOpenDropdown(link.label)
                }
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {link.children ? (
                  <button
                    className={`flex items-center gap-1 text-[13px] font-medium transition-colors duration-300 ${
                      scrolled || !isHome
                        ? "text-foreground/60 hover:text-foreground"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`size-3 transition-transform duration-300 ${
                        openDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={`text-[13px] font-medium transition-colors duration-300 ${
                      pathname === link.href
                        ? "text-primary"
                        : scrolled || !isHome
                          ? "text-foreground/60 hover:text-foreground"
                          : "text-white/70 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown */}
                {link.children && (
                  <div
                    className={`absolute top-full left-1/2 z-50 -translate-x-1/2 pt-4 transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      openDropdown === link.label
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-1 opacity-0"
                    }`}
                  >
                    <div className="border-border/50 bg-background/95 shadow-dropdown min-w-[280px] rounded-2xl border p-1.5 backdrop-blur-xl">
                      {link.children.map((child) =>
                        child.children ? (
                          <div key={child.href}>
                            <Link
                              href={child.href}
                              className="text-foreground hover:bg-muted/50 block rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200"
                            >
                              {child.label}
                            </Link>
                            {child.children.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className="text-foreground/60 hover:bg-muted/50 hover:text-foreground block rounded-xl px-4 py-2.5 pl-7 text-[13px] transition-colors duration-200"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="text-foreground/70 hover:bg-muted/50 hover:text-foreground block rounded-xl px-4 py-2.5 text-sm transition-colors duration-200"
                          >
                            {child.label}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link
            href="/get-involved"
            className={`hidden rounded-full px-6 py-2.5 text-[13px] font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] lg:inline-flex ${
              scrolled || !isHome
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            Get Involved
          </Link>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 flex size-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label="Menu"
          >
            <span
              className={`h-[1.5px] w-5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                mobileOpen
                  ? "bg-foreground translate-y-[4px] rotate-45"
                  : scrolled || !isHome
                    ? "bg-foreground"
                    : "bg-white"
              }`}
            />
            <span
              className={`h-[1.5px] w-5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                mobileOpen
                  ? "bg-foreground -translate-y-[2px] -rotate-45"
                  : scrolled || !isHome
                    ? "bg-foreground"
                    : "bg-white"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`bg-background fixed inset-0 z-30 transition-all duration-600 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="container flex h-full flex-col justify-center">
          {navLinks.map((link, i) => (
            <div
              key={link.label}
              className="border-border/20 border-b transition-all duration-700"
              style={{
                transitionDelay: mobileOpen ? `${80 + i * 40}ms` : "0ms",
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? "translateY(0)" : "translateY(1rem)",
              }}
            >
              {link.children ? (
                <>
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === link.label ? null : link.label
                      )
                    }
                    className="flex w-full items-center justify-between py-5 text-2xl font-bold"
                  >
                    {link.label}
                    <ChevronDown
                      className={`size-5 transition-transform duration-300 ${
                        openDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      openDropdown === link.label
                        ? "max-h-96 pb-4 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {link.children.map((c) =>
                      c.children ? (
                        <div key={c.href}>
                          <Link
                            href={c.href}
                            className="block py-2 pl-4 text-lg font-semibold"
                          >
                            {c.label}
                          </Link>
                          {c.children.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="text-muted-foreground block py-1.5 pl-8 text-base"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="text-muted-foreground block py-2 pl-4 text-lg"
                        >
                          {c.label}
                        </Link>
                      )
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href={link.href}
                  className="block py-5 text-2xl font-bold"
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
