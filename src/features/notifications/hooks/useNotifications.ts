"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../lib/service";

// Polled — no websocket library in this codebase. unreadCount rides on the
// same response as items, so this one query drives both the bell badge and
// the open dropdown panel.
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await getNotifications();
      return response.data;
    },
    refetchInterval: 30_000,
    retry: 1,
  });
}
