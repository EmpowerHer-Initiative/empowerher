import { Skeleton } from "@/components/ui/skeleton";

export default function ResourcesLoading() {
  return (
    <>
      {/* Header */}
      <section className="py-28 md:py-40">
        <div className="container">
          <div className="max-w-3xl">
            <Skeleton className="h-3 w-56" />
            <Skeleton className="mt-5 h-14 w-72 md:h-20 md:w-96" />
            <div className="mt-8 max-w-xl space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </section>

      {/* Resource list */}
      <section className="pb-28 md:pb-40">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <Skeleton className="mb-8 h-4 w-48" />
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="border-border/40 flex flex-col gap-8 rounded-3xl border p-8 lg:flex-row lg:p-10"
                >
                  <div className="flex flex-1 flex-col gap-4">
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-4 w-40" />
                    <div className="space-y-2.5">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-11/12" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <Skeleton className="mt-auto h-12 w-28 rounded-full" />
                  </div>
                  <Skeleton className="aspect-video w-full shrink-0 rounded-2xl lg:aspect-square lg:w-72" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
