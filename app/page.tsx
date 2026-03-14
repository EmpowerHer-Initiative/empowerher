// app/page.tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Users,
  CheckCircle2,
  Quote,
} from "lucide-react"
import Link from "next/link"
import { Hero } from "@/components/landing-page/hero"
import { Features } from "@/components/landing-page/features"
import { Results } from "@/components/landing-page/results"
import { Trust } from "@/components/landing-page/trust"
import { Testimonials } from "@/components/landing-page/testimonials"
import { Pricing } from "@/components/landing-page/pricing"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechFlow",
    content:
      "This platform transformed our workflow entirely. We saw a 40% increase in productivity within the first month.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "CTO, ScaleUp",
    content:
      "The best investment we've made this year. The team collaboration features alone are worth every penny.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Founder, Bloom",
    content:
      "Intuitive, powerful, and beautifully designed. Our clients love the results we deliver using this tool.",
    rating: 5,
  },
]

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Results />
      <div className="my-24 space-y-24">
        <Trust />
        <Features />
        <Testimonials />
        <Pricing />
      </div>
      <main className="flex-1">
        {/* Pricing Section */}

        {/* CTA Section */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="rounded-2xl bg-primary p-10 text-center text-primary-foreground md:p-16">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Ready to get started?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-lg text-primary-foreground/80">
                Join thousands of happy customers and start building something
                amazing today.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" className="gap-2 px-8">
                  Start your free trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  Talk to sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="text-lg font-bold">
                <span className="text-primary">Brand</span>
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
