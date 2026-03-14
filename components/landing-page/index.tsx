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

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized performance that keeps your users engaged and your bounce rate low.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "Enterprise-grade security built into every layer of the platform.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Deep insights into user behavior with real-time dashboards and reports.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Seamlessly work together with role-based access and shared workspaces.",
  },
]

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

const pricingPlans = [
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    description: "Perfect for individuals and small projects",
    features: [
      "Up to 5 projects",
      "Basic analytics",
      "Email support",
      "1 GB storage",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "Ideal for growing teams and businesses",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "50 GB storage",
      "Team collaboration",
      "Custom integrations",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For large organizations with advanced needs",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "SSO & SAML",
      "Unlimited storage",
      "Custom SLA",
      "On-premise option",
    ],
    highlighted: false,
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-primary">Brand</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}

        {/* Logos / Social Proof Bar */}
        <section className="border-y border-border/40 py-10">
          <div className="container mx-auto max-w-6xl px-4">
            <p className="mb-8 text-center text-sm font-medium tracking-wider text-muted-foreground uppercase">
              Trusted by teams at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-muted-foreground/50">
              {["Acme Corp", "Globex", "Initech", "Umbrella", "Stark Ind."].map(
                (company) => (
                  <span
                    key={company}
                    className="text-lg font-bold tracking-wide"
                  >
                    {company}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 md:py-32">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-16 text-center">
              <Badge variant="outline" className="mb-4">
                Features
              </Badge>
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Everything you need to succeed
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Powerful features designed to help you work smarter, not harder.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="group relative overflow-hidden border-border/50 bg-card/50 transition-all hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: "10K+", label: "Active Users" },
                { value: "99.9%", label: "Uptime" },
                { value: "50M+", label: "Requests/Day" },
                { value: "4.9/5", label: "User Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="mb-2 text-3xl font-bold md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-primary-foreground/70">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 md:py-32">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-16 text-center">
              <Badge variant="outline" className="mb-4">
                Testimonials
              </Badge>
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Loved by thousands
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Don&apos;t just take our word for it — hear from our customers.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.name}
                  className="relative border-border/50"
                >
                  <CardHeader className="pb-3">
                    <Quote className="mb-2 h-8 w-8 text-primary/20" />
                    <div className="flex gap-0.5">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        )
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      &quot;{testimonial.content}&quot;
                    </p>
                    <div>
                      <p className="text-sm font-semibold">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="bg-muted/30 py-24 md:py-32">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-16 text-center">
              <Badge variant="outline" className="mb-4">
                Pricing
              </Badge>
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Choose the plan that fits your needs. Upgrade or downgrade at
                any time.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative flex flex-col ${
                    plan.highlighted
                      ? "scale-[1.02] border-primary shadow-lg shadow-primary/10"
                      : "border-border/50"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <ul className="mb-8 flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      Get started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

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
    </div>
  )
}
