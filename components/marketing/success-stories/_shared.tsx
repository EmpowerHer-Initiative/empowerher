import { Calendar, Heart, Star } from "lucide-react";

export type Stat = {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
};

export const StatBox = ({ icon: Icon, value, label }: Stat) => (
  <div className="bg-muted/50 rounded-2xl p-5">
    <div className="flex items-center gap-2.5">
      <Icon className="text-primary size-5" />
      <span className="text-foreground text-base font-semibold">{value}</span>
    </div>
    <p className="text-muted-foreground mt-1.5 text-sm">{label}</p>
  </div>
);

type StoryCardProps = {
  logo: string;
  title: string;
  subtitle?: string;
  date?: string;
  badge?: string;
  stats?: Stat[];
  children: React.ReactNode;
};

export const StoryCard = ({
  logo,
  title,
  subtitle,
  date,
  badge,
  stats,
  children,
}: StoryCardProps) => (
  <div className="border-border/60 bg-background mx-auto max-w-4xl rounded-3xl border p-8 shadow-sm md:p-12">
    {/* Logo */}
    <div className="border-border/60 size-28 overflow-hidden rounded-2xl border bg-white">
      <img
        src={logo}
        alt={title}
        className="h-full w-full object-contain px-2"
      />
    </div>

    {/* Title + badge */}
    <div className="mt-8 flex items-start justify-between gap-6">
      <h2 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h2>
      {badge && (
        <span className="bg-primary/10 text-primary inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium">
          <Star className="size-3.5 fill-current" />
          {badge}
        </span>
      )}
    </div>

    {subtitle && (
      <p className="text-muted-foreground mt-3 text-lg italic">{subtitle}</p>
    )}

    {date && (
      <div className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
        <Calendar className="size-4" />
        {date}
      </div>
    )}

    {/* Stats */}
    {stats && stats.length > 0 && (
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <StatBox key={s.value} {...s} />
        ))}
      </div>
    )}

    {/* Body */}
    <div className="mt-10 space-y-6">{children}</div>
  </div>
);

export const QuoteBox = ({
  children,
  author,
}: {
  children: React.ReactNode;
  author?: string;
}) => (
  <div className="bg-muted/50 border-l-primary rounded-2xl border-l-4 p-6 md:p-8">
    <p className="text-foreground/80 text-base leading-relaxed">{children}</p>
    {author && (
      <p className="text-foreground mt-4 text-sm font-semibold">— {author}</p>
    )}
  </div>
);

export const ImpactBox = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-muted/50 rounded-2xl p-6 md:p-8">
    <div className="text-primary flex items-center gap-2.5">
      <Heart className="size-5" />
      <p className="text-foreground text-base font-semibold">{title}</p>
    </div>
    <p className="text-muted-foreground mt-3 text-base leading-relaxed">
      {children}
    </p>
  </div>
);
