"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links: { label: string; href: string }[] = [
  { label: "Users", href: "/admin/users" },
  { label: "Logs", href: "/admin/logs" },
  { label: "Comments", href: "/admin/comments" },
  { label: "Resources", href: "/admin/resources" },
  { label: "Featured Writings", href: "/admin/featured-writings" },
  { label: "All Students", href: "/admin/all-students" },
  { label: "Media", href: "/admin/media" },
  { label: "Staff Area", href: "/staff" },
];

export const NavbarAdmin = () => {
  const pathname = usePathname();
  const isActive = (link: (typeof links)[number]) =>
    pathname.startsWith(link.href);

  return (
    <div className="bg-muted sticky top-0 z-50 w-full border-b px-4">
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
  );
};
