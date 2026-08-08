"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "@/components/logout-button";

const links: { label: string; href: string; deprecated?: boolean }[] = [
  { label: "Users", href: "/users" },
  { label: "Logs", href: "/logs", deprecated: true },
  { label: "Comments", href: "/comments", deprecated: true },
  { label: "Resources", href: "/resources", deprecated: true },
  { label: "HerVoice", href: "/hervoice", deprecated: true },
  { label: "Featured Writings", href: "/featured-writings", deprecated: true },
  { label: "All Students", href: "/all-students" },
  { label: "Staffs", href: "/staffs", deprecated: true },
  { label: "Workshops", href: "/workshops", deprecated: true },
  { label: "Partners", href: "/partners", deprecated: true },
  { label: "Staff Area", href: "/staff" },
];

const activeLinks = links.filter((link) => !link.deprecated);
const deprecatedLinks = links.filter((link) => link.deprecated);

export const NavbarAdmin = () => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);
  const deprecatedActive = deprecatedLinks.some((link) => isActive(link.href));

  return (
    <div className="bg-muted sticky top-0 z-50 flex w-full items-center border-b px-4">
      <div className="flex flex-1 items-center">
        {activeLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            target={link.href.startsWith("https") ? "_blank" : undefined}
            className={cn(
              "text-muted-foreground hover:text-foreground inline-block border-b border-transparent p-3 text-sm capitalize transition-[colors] duration-200",
              isActive(link.href) && "border-b-foreground text-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}

        {deprecatedLinks.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "text-muted-foreground hover:text-foreground inline-flex items-center gap-1 border-b border-transparent p-3 text-sm transition-[colors] duration-200 outline-none",
                deprecatedActive && "border-b-foreground text-foreground"
              )}
            >
              Deprecated links
              <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  Deprecated — kept for reference
                </DropdownMenuLabel>
                {deprecatedLinks.map((link) => (
                  <DropdownMenuItem
                    key={link.href}
                    render={<Link href={link.href} />}
                    className={cn(
                      "capitalize",
                      isActive(link.href) && "text-foreground font-medium"
                    )}
                  >
                    {link.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <LogoutButton size="sm" className="shrink-0" />
    </div>
  );
};
