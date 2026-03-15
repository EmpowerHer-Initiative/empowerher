import { cn } from "@/lib/utils";

import { NavbarAdmin } from "@/components/admin/navbar-admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-12 pb-48",
        "[&_h1]:text-foreground [&_h1]:text-4xl [&_h1]:font-bold"
      )}
    >
      <NavbarAdmin />
      {children}
    </div>
  );
}
