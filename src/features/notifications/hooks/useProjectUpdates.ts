"use client";

import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { ProjectTab } from "@/src/features/projects/lib/project-tabs";
import { getNotifications, markNotificationRead } from "../lib/service";
import { updateTarget } from "../lib/updateTarget";
import type { UpdateTarget } from "../lib/updateTarget";
import type { Notification } from "../types/notification";

// Under ["notifications"] so everything that refreshes the bell (mark read,
// mark all read, reconnect) refreshes the dots too. NotificationsRealtime
// invalidates it explicitly for pushed notifications.
export const UNREAD_UPDATES_KEY = ["notifications", "unread-updates"] as const;

// The list endpoint has no unread filter and pages 20 at a time, so walk the
// pages until every unread notification is collected (unreadCount says how
// many there are), capped so a huge backlog can't fan out into many calls.
const MAX_PAGES = 5;

async function fetchUnreadUpdates(): Promise<UpdateTarget[]> {
  const unread: Notification[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    const { data } = await getNotifications(cursor);
    if (!data) break;

    unread.push(...data.items.filter((item) => !item.isRead));
    if (unread.length >= data.unreadCount || !data.hasMore || !data.nextCursor) break;
    cursor = data.nextCursor;
  }

  return unread.map(updateTarget);
}

function useUnreadUpdates() {
  return useQuery({
    queryKey: UNREAD_UPDATES_KEY,
    queryFn: fetchUnreadUpdates,
    // Pushes and read actions keep it fresh; this is only a backstop, same
    // as the bell's poll.
    refetchInterval: 5 * 60_000,
    retry: 1,
  });
}

// Red-dot lookups. A project/tab/record "has updates" while it has unread
// notifications pointing at it.
export function useProjectUpdates() {
  const { data } = useUnreadUpdates();

  return useMemo(() => {
    const updates = data ?? [];
    return {
      any: updates.length > 0,
      forProject: (projectId: string | number) =>
        updates.some((u) => u.projectId === String(projectId)),
      forTab: (projectId: string | number, tab: ProjectTab) =>
        updates.some((u) => u.projectId === String(projectId) && u.tab === tab),
      forItem: (projectId: string | number, tab: ProjectTab, itemId: string | number) =>
        updates.some(
          (u) => u.projectId === String(projectId) && u.tab === tab && u.itemId === String(itemId),
        ),
    };
  }, [data]);
}

// Ids already being marked read, so re-renders while the requests are in
// flight don't send them again.
const pending = new Set<number>();

// Marks the updates for what the user just opened as read, which clears the
// dot there and up the chain (tab, project row, sidebar) and in the bell.
// With an itemId it clears that record's updates (the milestone page, an
// opened change request/dispute, an expanded payment row); with null, the
// tab-wide ones (chat, overview, or records with no id in their link).
export function useClearUpdates(
  projectId: string,
  tab: ProjectTab,
  itemId: string | number | null,
  enabled = true,
) {
  const queryClient = useQueryClient();
  const { data } = useUnreadUpdates();
  const item = itemId == null ? null : String(itemId);

  useEffect(() => {
    if (!enabled || !data) return;

    const ids = data
      .filter((u) => u.projectId === projectId && u.tab === tab && u.itemId === item)
      .map((u) => u.notificationId)
      .filter((id) => !pending.has(id));
    if (ids.length === 0) return;

    ids.forEach((id) => pending.add(id));
    // Optimistic: the dot goes away now, not after the round trips.
    queryClient.setQueryData<UpdateTarget[]>(UNREAD_UPDATES_KEY, (previous) =>
      previous?.filter((u) => !ids.includes(u.notificationId)),
    );

    void Promise.allSettled(ids.map((id) => markNotificationRead(id))).then(() => {
      ids.forEach((id) => pending.delete(id));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });
  }, [data, enabled, item, projectId, queryClient, tab]);
}
