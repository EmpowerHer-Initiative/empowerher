import { BarChart3, Shield, Users, Zap } from "lucide-react";
import { motion } from "motion/react";

import { motionInView } from "@/lib/utils";

import { Badge } from "../ui/badge";

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
];

export const Features = () => {
  return (
    <section id="features" className="container scroll-mt-24">
      <motion.div
        className="mb-16"
        variants={motionInView}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
      >
        <Badge variant="outline" className="mb-4">
          Stake smart
        </Badge>
        <h2 className="mb-4 max-w-xl text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Why re-staking with Fox Protocol?
        </h2>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Maximize your staking and re-staking rewards while maintaining
          composibility for DeFi applications.
        </p>
      </motion.div>
      <motion.div
        className="grid gap-6 sm:grid-cols-2"
        variants={motionInView}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.4 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-muted/30 shadow-card relative flex flex-col gap-4 overflow-hidden rounded-2xl p-8"
          >
            <IconBox icon={feature.icon} />
            <div className="">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

function IconBox({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <div className="border-border bg-background flex h-12 w-12 items-center justify-center rounded-xl border">
      <Icon className="text-foreground h-5 w-5" strokeWidth={1.5} />
    </div>
  );
}
