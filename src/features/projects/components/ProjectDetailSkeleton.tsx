import Skeleton, { SkeletonRegion } from "@/src/shared/components/Skeleton";
import { PROJECT_TABS } from "../lib/project-tabs";

// The project detail page (both roles) while it loads: header card, tab bar
// and the overview's two cards. Shown by the route's loading.tsx, while the
// role is resolved, and while the project itself loads — the same shape at
// every step, so loading reads as one continuous state.
export function ProjectDetailSkeleton({
  withBackLink = true,
}: {
  /** False when the caller already renders the real back link. */
  withBackLink?: boolean;
}) {
  return (
    <SkeletonRegion className="space-y-6">
      {withBackLink && <Skeleton className="w-32 h-5" />}

      <div className="bg-(--card-bg) p-4 sm:p-6 border border-border rounded-2xl">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-48 sm:w-64 h-7" />
              <Skeleton className="rounded-full w-16 h-6" />
            </div>
            <Skeleton className="w-40 h-4" />
            <Skeleton className="w-full max-w-lg h-4" />
          </div>
          <Skeleton className="rounded-lg w-20 h-8 sm:h-9" />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 bg-surface p-1 rounded-xl">
        {PROJECT_TABS.map((tab) => (
          <Skeleton key={tab} className="rounded-lg w-16 sm:w-24 h-8 sm:h-9" />
        ))}
      </div>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        {[0, 1].map((card) => (
          <div
            key={card}
            className="space-y-3 bg-surface p-6 border border-border rounded-2xl"
          >
            <Skeleton className="w-24 h-3" />
            <Skeleton className="w-44 h-5" />
            <Skeleton className="w-32 h-4" />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}
