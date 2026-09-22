"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getChangeRequests } from "../lib/service";

// Cursor-paginated, mirrors useNotifications's infinite-query shape.
export function useChangeRequests(projectId: string) {
  return useInfiniteQuery({
    queryKey: ["change-requests", projectId],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      const response = await getChangeRequests(projectId, pageParam);
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    retry: 1,
  });
}
