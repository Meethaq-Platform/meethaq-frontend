"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";

import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import { useActivity } from "./useActivity";
import type { ActivityLogEntry } from "../types/activity";

// Activity entries can't be matched one-to-one to notifications, so the
// Activity tab marks entries "new" by time instead: anything someone else did
// after the user last looked at this project's Activity tab. The last-seen
// time is remembered per user and project in this browser only.
const CHANGE_EVENT = "activity-seen-change";

function storageKey(userId: string, projectId: string) {
  return `activity-seen:${userId}:${projectId}`;
}

function readSeen(key: string | null): number | null {
  if (!key) return null;
  try {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

function writeSeen(key: string, value: number) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // Best-effort: blocked storage just means dots don't persist.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const time = (entry: ActivityLogEntry) => new Date(entry.createdAt).getTime();

export function useActivityUpdates(projectId: string) {
  const { data: user } = useCurrentUser();
  const { data: entries } = useActivity(projectId);
  const key = user ? storageKey(user.id, projectId) : null;

  const seenAt = useSyncExternalStore(
    subscribe,
    () => readSeen(key),
    () => null,
  );

  // Others' entries only — the user's own actions are never news to them.
  const othersEntries = useMemo(
    () => (entries ?? []).filter((entry) => entry.performedByUserId !== user?.id),
    [entries, user?.id],
  );
  // Seen up to the newest entry, not "now", so the browser's clock never
  // decides what's new against the server's timestamps.
  const latest = othersEntries.reduce((max, entry) => Math.max(max, time(entry)), 0);

  // First time this project is seen here: start from "everything so far is
  // seen" instead of flagging the whole history as new.
  useEffect(() => {
    if (key && entries && seenAt === null) writeSeen(key, latest || Date.now());
  }, [entries, key, latest, seenAt]);

  const markSeen = useCallback(() => {
    if (key && latest && (seenAt === null || latest > seenAt)) writeSeen(key, latest);
  }, [key, latest, seenAt]);

  return {
    seenAt,
    hasNew: seenAt !== null && latest > seenAt,
    isNew: (entry: ActivityLogEntry, since: number | null) =>
      since !== null && entry.performedByUserId !== user?.id && time(entry) > since,
    markSeen,
  };
}
