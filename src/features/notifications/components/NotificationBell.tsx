"use client";

import type { UIEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";

import { useNotifications } from "../hooks/useNotifications";
import { useMarkNotificationRead } from "../hooks/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "../hooks/useMarkAllNotificationsRead";
import { NotificationRow } from "./NotificationRow";
import Spinner from "@/src/shared/components/Spinner";
import EmptyState from "@/src/shared/components/EmptyState";

// Fetch the next page once the panel is scrolled within this many pixels of
// its bottom edge.
const SCROLL_THRESHOLD_PX = 48;

// Replaces the previously-static NotificationButton stub. No shared
// Popover exists in this codebase, so the dropdown panel is hand-rolled
// (absolute positioning + a document click listener to close on outside click).
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const items = data?.pages.flatMap((page) => page?.items ?? []) ?? [];
  // The freshest page's unreadCount is the authoritative running total —
  // every page carries the same global count, duplicated at fetch time.
  const unreadCount = data?.pages[0]?.unreadCount ?? 0;

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD_PX) {
      fetchNextPage();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        className="relative hover:bg-surface-muted p-2 rounded-lg text-text-secondary hover:text-text-primary transition"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="top-1.5 right-1.5 absolute bg-danger rounded-full w-2 h-2" />
        )}
      </button>

      {open && (
        // Below `sm`, the bell sits well inside the header (the user menu
        // and header padding take up space to its right), so a 320px panel
        // anchored to the bell's own edge (the original `absolute right-0`)
        // ran off the left side of narrow viewports. `fixed` + `inset-x-4`
        // pins it to the viewport itself instead of the bell on small
        // screens; `sm:` and up restores the original bell-anchored panel
        // where there's room for it.
        <div className="inset-x-4 top-16 sm:top-full sm:right-0 sm:left-auto z-50 fixed sm:absolute bg-surface shadow-xl sm:mt-2 border border-border rounded-2xl sm:w-80 max-h-[28rem] overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-border border-b">
            <h2 className="font-semibold text-text-primary text-sm">Notifications</h2>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllRead.mutate()}
                className="flex items-center gap-1 font-medium text-primary text-xs hover:underline"
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto" onScroll={handleScroll}>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size={20} />
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-6">
                <EmptyState icon={Bell} title="No notifications yet" />
              </div>
            ) : (
              <>
                {items.map((notification) => (
                  <NotificationRow
                    key={notification.notificationId}
                    notification={notification}
                    onOpen={(id) => {
                      markRead.mutate(id);
                      setOpen(false);
                    }}
                  />
                ))}

                {isFetchingNextPage && (
                  <div className="flex justify-center py-3">
                    <Loader2 size={16} className="text-text-secondary animate-spin" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
