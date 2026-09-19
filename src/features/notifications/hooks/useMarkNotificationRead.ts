"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationRead } from "../lib/service";
import type { NotificationListData } from "../types/notification";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["mark-notification-read"],
    mutationFn: markNotificationRead,
    meta: { suppressToast: true },
    onSuccess: (_response, notificationId) => {
      queryClient.setQueryData<NotificationListData | null | undefined>(
        ["notifications"],
        (previous) => {
          if (!previous) return previous;

          const target = previous.items.find(
            (item) => item.notificationId === notificationId,
          );
          if (!target || target.isRead) return previous;

          return {
            ...previous,
            items: previous.items.map((item) =>
              item.notificationId === notificationId ? { ...item, isRead: true } : item,
            ),
            unreadCount: Math.max(0, previous.unreadCount - 1),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
