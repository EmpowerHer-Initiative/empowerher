"use client";

import { usePathname } from "next/navigation";

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

  return <footer>Footer</footer>;
};
