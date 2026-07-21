import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="container mt-12">
      <Skeleton className="mb-8 h-10 w-64" />

      <div className="mb-6 flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="overflow-hidden rounded-md border">
        <Skeleton className="h-12 w-full rounded-none" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border-t p-4">
            <div className="flex items-center gap-6">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="ml-auto h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
