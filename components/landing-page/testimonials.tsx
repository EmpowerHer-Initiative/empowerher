import { Quote, Star } from "lucide-react";
import { motion } from "motion/react";

import { motionInView } from "@/lib/utils";

import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";

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
  {
    name: "Lisa Patel",
    role: "Head of Product, NovaOps",
    content:
      "We switched to this platform and immediately noticed how much easier it was for our whole team to stay in sync. The analytics are a game changer.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "VP of Engineering, NextGen Solutions",
    content:
      "Reliable, secure, and incredibly user-friendly. The onboarding process for new engineers has never been smoother.",
    rating: 5,
  },
  {
    name: "Anna Müller",
    role: "COO, Fintrax",
    content:
      "Customer support is outstanding and the speed of feature development impresses us every time.",
    rating: 4,
  },
  {
    name: "Tomás Alvarez",
    role: "Lead Developer, Quantum Leap",
    content:
      "A robust solution that scales with us. We especially appreciate the flexible integration options.",
    rating: 5,
  },
  {
    name: "Jenna Williams",
    role: "Marketing Manager, SpringBoard",
    content:
      "The detailed reporting saves our team hours each week and helps demonstrate value to our clients.",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <motion.div
      variants={motionInView}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      id="testimonials"
      className="bg-muted container mx-auto max-w-[1500px] scroll-mt-24 border p-8 xl:rounded-4xl"
    >
      <div className="mb-16">
        <Badge variant="outline" className="mb-4">
          Testimonials
        </Badge>
        <h2 className="mb-4 max-w-xl text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Loved by thousands
        </h2>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Don&apos;t just take our word for it — hear from our customers.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="border-border/50 relative">
            <CardHeader className="pb-3">
              <Quote className="text-primary/20 mb-2 h-8 w-8" />
              <div className="flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>
              <div>
                <p className="text-sm font-semibold">{testimonial.name}</p>
                <p className="text-muted-foreground text-xs">
                  {testimonial.role}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
