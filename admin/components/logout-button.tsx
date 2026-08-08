"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useLogout } from "@/services/auth/hooks/use-functions";

import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
};

export const LogoutButton = ({
  variant = "ghost",
  size,
  className,
}: LogoutButtonProps) => {
  const router = useRouter();
  const logout = useLogout();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={logout.isPending}
      onClick={() =>
        logout.mutate(undefined, {
          onSuccess: () => router.replace("/login"),
        })
      }
    >
      <LogOut className="size-4" />
      {logout.isPending ? "Logging out…" : "Log out"}
    </Button>
  );
};
