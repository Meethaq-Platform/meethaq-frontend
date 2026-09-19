"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

import { useNotifications } from "../hooks/useNotifications";
import { useMarkNotificationRead } from "../hooks/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "../hooks/useMarkAllNotificationsRead";
import { NotificationRow } from "./NotificationRow";
import Spinner from "@/src/shared/components/Spinner";
import EmptyState from "@/src/shared/components/EmptyState";

// Replaces the previously-static NotificationButton stub. No shared
// Popover exists in this codebase, so the dropdown panel is hand-rolled
// (absolute positioning + a document click listener to close on outside click).
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useNotifications();
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

  const unreadCount = data?.unreadCount ?? 0;

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
        <div className="right-0 z-50 absolute bg-surface shadow-xl mt-2 border border-border rounded-2xl w-80 max-h-[28rem] overflow-hidden">
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

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size={20} />
              </div>
            ) : !data || data.items.length === 0 ? (
              <div className="px-4 py-6">
                <EmptyState icon={Bell} title="No notifications yet" />
              </div>
            ) : (
              data.items.map((notification) => (
                <NotificationRow
                  key={notification.notificationId}
                  notification={notification}
                  onOpen={(id) => {
                    markRead.mutate(id);
                    setOpen(false);
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
