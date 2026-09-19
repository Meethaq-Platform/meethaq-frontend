"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { markNotificationRead } from "../lib/service";
import type { NotificationListData } from "../types/notification";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["mark-notification-read"],
    mutationFn: markNotificationRead,
    meta: { suppressToast: true },
    onSuccess: (_response, notificationId) => {
      queryClient.setQueryData<InfiniteData<NotificationListData> | undefined>(
        ["notifications"],
        (previous) => {
          if (!previous) return previous;

          const alreadyRead = previous.pages
            .flatMap((page) => page.items)
            .find((item) => item.notificationId === notificationId)?.isRead;
          if (alreadyRead !== false) return previous;

          return {
            ...previous,
            // unreadCount is the same global total duplicated on every page
            // response, so every page's copy is decremented together.
            pages: previous.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.notificationId === notificationId
                  ? { ...item, isRead: true }
                  : item,
              ),
              unreadCount: Math.max(0, page.unreadCount - 1),
            })),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
