"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsRead } from "../lib/service";
import type { NotificationListData } from "../types/notification";

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["mark-all-notifications-read"],
    mutationFn: markAllNotificationsRead,
    meta: { suppressToast: true },
    onSuccess: () => {
      queryClient.setQueryData<NotificationListData | null | undefined>(
        ["notifications"],
        (previous) =>
          previous
            ? {
                ...previous,
                items: previous.items.map((item) => ({ ...item, isRead: true })),
                unreadCount: 0,
              }
            : previous,
      );
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
