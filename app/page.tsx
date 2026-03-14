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
import { Cta } from "@/components/landing-page/cta"

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
    </>
  )
}
