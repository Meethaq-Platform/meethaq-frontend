import type { ReactNode } from "react";

import Skeleton from "./Skeleton";

interface ListPageSkeletonProps {
  /** Number of status filter pills beside the search box (0 for none). */
  filters?: number;
  /** The table placeholder, e.g. <ProjectsTableSkeleton />. */
  children: ReactNode;
}

// Header (title, subtitle, add button) + toolbar (search, filters) + table —
// the shape shared by the Projects and Clients list pages, for their route
// loading state and while the user's role is still being resolved.
export default function ListPageSkeleton({ filters = 0, children }: ListPageSkeletonProps) {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="w-36 h-7" />
          <Skeleton className="w-56 h-4" />
        </div>
        <Skeleton className="rounded-lg w-32 h-11" />
      </div>

      <div className="flex sm:flex-row flex-col gap-3">
        <Skeleton className="flex-1 sm:max-w-md rounded-xl h-8 sm:h-9" />
        {filters > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 sm:ms-auto">
            {Array.from({ length: filters }, (_, i) => (
              <Skeleton key={i} className="rounded-lg w-16 sm:w-20 h-8 sm:h-9" />
            ))}
          </div>
        )}
      </div>

      {children}
    </>
  );
}
