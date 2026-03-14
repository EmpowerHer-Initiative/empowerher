export const Trust = () => {
  return (
    <div className="container mx-auto max-w-6xl px-4">
      <p className="mb-8 text-center text-sm font-medium tracking-wider text-muted-foreground uppercase">
        Trusted by teams at
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-muted-foreground/50">
        {["Acme Corp", "Globex", "Initech", "Umbrella", "Stark Ind."].map(
          (company) => (
            <span key={company} className="text-lg font-bold tracking-wide">
              {company}
            </span>
          )
        )}
      </div>
    </div>
  )
}
