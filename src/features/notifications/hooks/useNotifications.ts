"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "../lib/service";

// Polled — no websocket library in this codebase. unreadCount rides on
// every page's response, so it stays available however many pages are
// loaded. Pagination itself is cursor-based (infinite scroll on the
// dropdown panel), not offset-based.
export function useNotifications() {
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      const response = await getNotifications(pageParam);
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    refetchInterval: 30_000,
    retry: 1,
  });
}
