"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { LogoutButton } from "@/components/logout-button";

const links: { label: string; href: string }[] = [
  { label: "Users", href: "/users" },
  { label: "Logs", href: "/logs" },
  { label: "Comments", href: "/comments" },
  { label: "Resources", href: "/resources" },
  { label: "HerVoice", href: "/hervoice" },
  { label: "Featured Writings", href: "/featured-writings" },
  { label: "All Students", href: "/all-students" },
  { label: "Staffs", href: "/staffs" },
  { label: "Workshops", href: "/workshops" },
  { label: "Partners", href: "/partners" },
  { label: "Media", href: "/media" },
  { label: "Staff Area", href: "/staff" },
];

export const NavbarAdmin = () => {
  const pathname = usePathname();
  const isActive = (link: (typeof links)[number]) =>
    pathname.startsWith(link.href);

  return (
    <div className="bg-muted sticky top-0 z-50 flex w-full items-center border-b px-4">
      <div className="flex-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            target={link.href.startsWith("https") ? "_blank" : undefined}
            className={cn(
              "text-muted-foreground hover:text-foreground inline-block border-b border-transparent p-3 text-sm capitalize transition-[colors] duration-200",
              isActive(link) && "border-b-foreground text-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <LogoutButton size="sm" className="shrink-0" />
    </div>
  );
};
