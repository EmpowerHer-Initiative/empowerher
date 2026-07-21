export const Article = ({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="border-border/30 scroll-mt-32 border-t py-16">
    <div className="grid gap-8 md:grid-cols-12">
      <div className="md:col-span-4">
        <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-serif text-2xl leading-tight md:text-3xl">
          {title}
        </h2>
      </div>
      <div className="text-muted-foreground space-y-4 text-sm leading-[1.9] md:col-span-8">
        {children}
      </div>
    </div>
  </section>
);
