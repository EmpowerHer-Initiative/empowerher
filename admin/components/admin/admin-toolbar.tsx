"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WrenchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/services/auth/hooks/use-user";

import { Button } from "@/components/ui/button";

const HIDDEN_PATHS = ["/login", "/signup", "/reset-password"];

export const AdminToolbar = () => {
  const { data: session } = useCurrentUser();
  const pathname = usePathname();

  if (!session || session.user.role !== "admin") return null;
  if (pathname.startsWith("/admin")) return null;
  if (pathname.startsWith("/ui")) return null;
  if (HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <Button
      size={"icon"}
      className={cn(
        "shadow-dialog fixed right-4 bottom-4 size-16 rounded-full"
      )}
      render={
        <Link href={"/admin"}>
          <WrenchIcon className="size-5" />
        </Link>
      }
    />
  );
};
