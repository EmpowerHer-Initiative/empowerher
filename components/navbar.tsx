"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/services/auth/hooks/use-user";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { Logo } from "./icons/logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const links = [
  {
    label: "Features",
    href: "/#features",
  },
  {
    label: "Pricing",
    href: "/#pricing",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith("/#")) return;
    e.preventDefault();
    const id = href.slice(2);
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(href);
    }
  };

  const { data: user } = useCurrentUser();

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

  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-background/95 w-full border-b backdrop-blur-xs">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <Logo className="text-primary size-8" />
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <Link href="/settings">
                <Avatar>
                  <AvatarImage src={user.user.image ?? undefined} />
                  <AvatarFallback>{user.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button render={<Link href="/login">Log in</Link>} />
            )}
          </div>

          <div className="flex items-center gap-3 md:hidden">
            {user ? (
              <Link href="/settings">
                <Avatar>
                  <AvatarImage src={user.user.image ?? undefined} />
                  <AvatarFallback>{user.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button render={<Link href="/login">Log in</Link>} />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </Button>
          </div>
        </div>
      </nav>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "bg-background z-50 w-full overflow-hidden border-b backdrop-blur-xl md:hidden",
          isScrolled ? "fixed top-16" : "relative"
        )}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-col pt-2 pb-4"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground w-full px-5 py-4 text-2xl font-bold transition-colors"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};
