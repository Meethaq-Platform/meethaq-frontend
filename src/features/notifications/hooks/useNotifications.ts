"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "../lib/service";

// New notifications are pushed over SignalR (NotificationsRealtime writes
// them into this cache); the slow poll is only a backstop in case the hub
// connection silently stalls. unreadCount rides on every page's response,
// so it stays available however many pages are loaded. Pagination itself
// is cursor-based (infinite scroll on the dropdown panel), not offset-based.
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
    refetchInterval: 5 * 60_000,
    retry: 1,
  });
}
