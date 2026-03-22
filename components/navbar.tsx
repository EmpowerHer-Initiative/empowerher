"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/services/auth/hooks/use-user";
import { Menu } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Logo } from "./icons/logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const links = [
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Features",
    href: "#",
  },
  {
    label: "Pricing",
    href: "#",
  },
  {
    label: "Contact",
    href: "#",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const { data: user } = useCurrentUser();

  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/reset-password" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/ui")
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
            <Button>Log in</Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
              <Menu className="size-6" />
            </Button>
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, type: "spring", bounce: 0 }}
            className="fixed top-0 left-0 isolate z-50 h-full w-full py-8 md:hidden"
          >
            <div
              className="bg-background/95 absolute top-0 left-0 -z-10 h-full w-full backdrop-blur-xs"
              onClick={() => setIsOpen(false)}
            ></div>
            <div className="mb-10 flex flex-col items-center gap-8">
              <Logo className="size-10" />
            </div>
            <div className="flex flex-col items-center">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-foreground w-full py-4 text-center text-2xl font-bold transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
