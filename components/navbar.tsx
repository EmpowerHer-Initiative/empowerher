"use client";

import { usePathname } from "next/navigation";

// const links = [
//   { label: "Features", href: "/#features" },
//   { label: "Pricing", href: "/#pricing" },
//   { label: "Blog", href: "/blog" },
//   { label: "Contact", href: "/contact" },
// ];

export const Navbar = () => {
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

  return <nav className="bg-background sticky top-0 w-full">Navbar</nav>;
};
