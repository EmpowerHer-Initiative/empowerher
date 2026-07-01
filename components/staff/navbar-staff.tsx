"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useIsAdmin } from "@/services/auth/hooks/use-role";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PERIODS, usePeriod } from "@/components/staff/period-context";

const links: { label: string; href: string; adminOnly?: boolean }[] = [
  { label: "Accepted Students", href: "/staff/students" },
  { label: "Rejected Students", href: "/staff/rejected-students" },
  { label: "Staffs", href: "/staff/staffs", adminOnly: true },
];

export const NavbarStaff = () => {
  const pathname = usePathname();
  const { period, setPeriod } = usePeriod();
  const { isAdmin } = useIsAdmin();

  return (
    <div className="bg-muted sticky top-0 z-50 flex w-full items-center border-b px-4">
      <div>
        {links
          .filter((link) => !link.adminOnly || isAdmin)
          .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-muted-foreground hover:text-foreground inline-block border-b border-transparent p-3 text-sm capitalize transition-[colors] duration-200",
                pathname.startsWith(link.href) &&
                  "border-b-foreground text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        {isAdmin && (
          <Link
            href="/admin"
            className="text-muted-foreground hover:text-foreground inline-block border-b border-transparent p-3 text-sm transition-[colors] duration-200"
          >
            Admin →
          </Link>
        )}
      </div>
      <Select
        value={String(period)}
        onValueChange={(value) => setPeriod(Number(value))}
      >
        <SelectTrigger size="sm" className="ml-auto w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PERIODS.map((item) => (
            <SelectItem key={item} value={String(item)}>
              Period {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
