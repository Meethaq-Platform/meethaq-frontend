"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useNotificationsHub } from "../hooks/useNotificationsHub";
import { useMarkNotificationRead } from "../hooks/useMarkNotificationRead";
import type { Notification, NotificationListData } from "../types/notification";
import { notificationHref } from "../lib/notificationHref";
import { useEventText } from "@/src/shared/hooks/useEventText";

// Mounted once in the protected layout, which only renders for a signed-in
// user — so the hub connects on sign-in and closes when logout navigates
// away from it. Renders nothing; it feeds pushed notifications into the
// same ["notifications"] cache the bell reads, and toasts them.
export function NotificationsRealtime({ hubUrl }: { hubUrl: string | null }) {
  const t = useTranslations("notifications");
  const queryClient = useQueryClient();
  const router = useRouter();
  const eventText = useEventText();
  const markRead = useMarkNotificationRead();

  const handleNotification = (notification: Notification) => {
    let isNew = false;

    queryClient.setQueryData<InfiniteData<NotificationListData> | undefined>(
      ["notifications"],
      (previous) => {
        if (!previous?.pages.length) return previous;

        const exists = previous.pages.some((page) =>
          page.items.some((item) => item.notificationId === notification.notificationId),
        );
        if (exists) return previous;

        isNew = true;
        return {
          ...previous,
          // unreadCount is the same global total duplicated on every page
          // response, so every page's copy is incremented together.
          pages: previous.pages.map((page, index) => ({
            ...page,
            items: index === 0 ? [notification, ...page.items] : page.items,
            unreadCount: page.unreadCount + (notification.isRead ? 0 : 1),
          })),
        };
      },
    );

    // Nothing cached yet (the bell's first fetch is still in flight) — let
    // the query pick it up instead of seeding a one-item list.
    if (!queryClient.getQueryData(["notifications"])) {
      isNew = true;
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }

    if (!isNew) return;

    toast(eventText.notificationTitle(notification.eventType, notification.title), {
      // A redelivered notification replaces its toast rather than stacking.
      id: `notification-${notification.notificationId}`,
      description: eventText.sentence(notification.eventType, notification.message, {
        nameSource: notification.title,
      }),
      action: {
        label: t("view"),
        onClick: () => {
          markRead.mutate(notification.notificationId);
          router.push(notificationHref(notification));
        },
      },
    });
  };

  useNotificationsHub({
    hubUrl,
    onNotification: handleNotification,
    onReconnected: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return null;
}
