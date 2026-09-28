import Skeleton, { SkeletonRegion } from "@/src/shared/components/Skeleton";

// Both role dashboards share this grid: welcome + project overview, financial
// overview, needs-attention + upcoming, recent activity. Shown by the route's
// loading.tsx, while the role is resolved and while the dashboard loads.
export function DashboardSkeleton() {
  return (
    <SkeletonRegion className="flex flex-col gap-5">
      <Skeleton className="w-40 h-3" />

      <div className="flex lg:flex-row flex-col gap-5">
        <div className="flex-1 space-y-3 bg-surface p-5 sm:p-6 border border-border rounded-2xl min-w-0">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-56 h-7" />
          <Skeleton className="w-full max-w-md h-4" />
          <div className="flex gap-2 pt-3">
            <Skeleton className="rounded-xl w-36 h-10" />
            <Skeleton className="rounded-xl w-36 h-10" />
          </div>
        </div>
        <SectionSkeleton className="lg:w-96 shrink-0" rows={3} />
      </div>

      <SectionSkeleton rows={2} tall />

      <div className="flex lg:flex-row flex-col gap-5">
        <SectionSkeleton className="flex-1 min-w-0" rows={3} />
        <SectionSkeleton className="flex-1 min-w-0" rows={3} />
      </div>

      <SectionSkeleton rows={4} />
    </SkeletonRegion>
  );
}

// A SectionCard: title, then list rows (or a chart-height block when tall).
function SectionSkeleton({
  className = "",
  rows,
  tall = false,
}: {
  className?: string;
  rows: number;
  tall?: boolean;
}) {
  return (
    <div
      className={`bg-surface p-4 sm:p-5 border border-border rounded-2xl ${className}`}
    >
      <Skeleton className="mb-4 w-40 h-5" />
      {tall ? (
        <div className="space-y-4">
          <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="rounded-xl h-20" />
            ))}
          </div>
          <Skeleton className="rounded-xl h-48" />
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="rounded-full w-8 h-8 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="w-3/5 h-3.5" />
                <Skeleton className="w-2/5 h-3" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
