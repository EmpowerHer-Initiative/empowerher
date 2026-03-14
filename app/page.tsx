// app/page.tsx
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Quote,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cta } from "@/components/landing-page/cta";
import { Features } from "@/components/landing-page/features";
import { Hero } from "@/components/landing-page/hero";
import { Pricing } from "@/components/landing-page/pricing";
import { Results } from "@/components/landing-page/results";
import { Testimonials } from "@/components/landing-page/testimonials";
import { Trust } from "@/components/landing-page/trust";

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
];

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
  );
}
