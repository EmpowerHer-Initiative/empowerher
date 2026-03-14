import Link from "next/link"
import { Cta } from "./landing-page/cta"
import { Logo } from "./icons/logo"

export const Footer = () => {
  return (
    <>
      <Cta className="mb-30 md:-mb-30" />
      <footer className="dark rounded-t-3xl border-t border-border/40 bg-background/95 pt-12 pb-12 text-foreground md:rounded-t-[4rem] md:pt-48 dark:bg-muted">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/">
                <Logo className="size-10 text-foreground" />
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">
                Building the future, one project at a time.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Changelog", "Docs"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="mb-3 text-sm font-semibold">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Brand. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}
