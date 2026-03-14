import { Badge } from "../ui/badge"

import { Zap, Shield, BarChart3, Users } from "lucide-react"

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

export const Features = () => {
  return (
    <section className="container">
      <div className="mb-16">
        <Badge variant="outline" className="mb-4">
          Stake smart
        </Badge>
        <h2 className="mb-4 max-w-xl text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Why re-staking with Fox Protocol?
        </h2>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Maximize your staking and re-staking rewards while maintaining
          composibility for DeFi applications.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-muted/30 p-8 shadow-card"
          >
            <IconBox icon={feature.icon} />
            {/* <DotGrid className="right-8 bottom-12" /> */}
            <div className="">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function IconBox({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background">
      <Icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
    </div>
  )
}
