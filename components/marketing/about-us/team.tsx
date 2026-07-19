import { caller } from "@/services/trpc/server";

import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/reveal";

const LOGO_PLACEHOLDER =
  "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT8waekQlgkEDp7B3XRvCJzMmyWOSiao4I6cq9";

const memberSizes = {
  lg: {
    name: "text-lg md:text-xl",
    role: "mt-1.5 text-sm",
    pad: "px-3 pt-4 pb-5",
  },
  md: {
    name: "text-base",
    role: "mt-1 text-xs",
    pad: "px-2 pt-3 pb-4",
  },
  sm: {
    name: "text-sm",
    role: "mt-1 text-xs",
    pad: "px-2 pt-3 pb-4",
  },
} as const;

const TeamMember = ({
  member,
  index,
  size = "md",
}: {
  member: { name: string; role: string; image: string };
  index: number;
  size?: keyof typeof memberSizes;
}) => {
  const tint =
    index % 2 === 0
      ? "bg-primary/10 hover:shadow-primary/15"
      : "bg-secondary/25 hover:shadow-secondary/25";

  return (
    <div
      className={`group flex flex-col rounded-3xl p-2.5 text-center shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:shadow-lg ${tint}`}
    >
      <div className="aspect-square w-full overflow-hidden rounded-2xl">
        <img
          src={member.image}
          alt={member.name}
          className={`h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03] ${
            member.image === LOGO_PLACEHOLDER
              ? "bg-background object-cover"
              : "object-cover"
          }`}
        />
      </div>
      <div className={memberSizes[size].pad}>
        <p className={`leading-tight font-semibold ${memberSizes[size].name}`}>
          {member.name}
        </p>
        <p
          className={`text-muted-foreground leading-snug ${memberSizes[size].role}`}
        >
          {member.role}
        </p>
      </div>
    </div>
  );
};

export const TeamSection = async () => {
  const teachers = await caller.teachers.list();

  const toMember = (teacher: (typeof teachers)[number]) => ({
    name: teacher.name,
    role: teacher.headTitle,
    image: teacher.avatar || LOGO_PLACEHOLDER,
  });

  const executiveTeam = teachers
    .filter((t) => t.role === "executive")
    .map(toMember);
  const directors = teachers.filter((t) => t.role === "director").map(toMember);
  const mentorsTeam = teachers
    .filter((t) => t.role === "mentor" || t.role === "lecturer")
    .map(toMember);

  return (
    <section className="bg-foreground/[0.02] py-28 md:py-40">
      <div className="container">
        <Reveal asChild>
          <div className="mb-16">
            <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
              The People Behind It
            </p>
            <h2 className="font-serif text-4xl leading-[1.1] md:text-5xl">
              Our Team
            </h2>
            <p className="text-muted-foreground mt-4 max-w-lg">
              Founded and led by a diverse team committed to expanding access to
              education across borders.
            </p>
          </div>
        </Reveal>

        {executiveTeam.length > 0 && (
          <Reveal asChild>
            <div className="mb-14">
              <p className="text-muted-foreground mb-8 text-xs font-semibold tracking-[0.3em] uppercase">
                Executive Team
              </p>
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
                {executiveTeam.map((member, index) => (
                  <TeamMember
                    key={member.name}
                    member={member}
                    index={index}
                    size="lg"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {directors.length > 0 && (
          <Reveal asChild>
            <div className="border-border/40 mb-14 border-t pt-14">
              <p className="text-muted-foreground mb-8 text-xs font-semibold tracking-[0.3em] uppercase">
                Directors
              </p>
              <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                {directors.map((member, index) => (
                  <TeamMember
                    key={member.name}
                    member={member}
                    index={index}
                    size="md"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {mentorsTeam.length > 0 && (
          <Reveal asChild>
            <div className="border-border/40 border-t pt-14">
              <p className="text-muted-foreground mb-8 text-xs font-semibold tracking-[0.3em] uppercase">
                Mentors & Lecturers
              </p>
              <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {mentorsTeam.map((member, index) => (
                  <TeamMember
                    key={member.name}
                    member={member}
                    index={index}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export const TeamSectionSkeleton = () => (
  <section className="bg-foreground/[0.02] py-28 md:py-40">
    <div className="container">
      <div className="mb-16">
        <Skeleton className="mb-4 h-3 w-44" />
        <Skeleton className="h-10 w-56 md:h-12" />
        <div className="mt-4 max-w-lg space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      <div className="mb-14">
        <Skeleton className="mb-8 h-3 w-32" />
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-3xl p-2.5">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <div className="px-3 pt-4 pb-5">
                <Skeleton className="mx-auto h-5 w-32" />
                <Skeleton className="mx-auto mt-2 h-3.5 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-border/40 border-t pt-14">
        <Skeleton className="mb-8 h-3 w-24" />
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-3xl p-2.5">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <div className="px-2 pt-3 pb-4">
                <Skeleton className="mx-auto h-4 w-24" />
                <Skeleton className="mx-auto mt-2 h-3 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
