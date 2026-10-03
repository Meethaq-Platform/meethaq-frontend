import {
  DEFAULT_PROJECT_TAB,
  isProjectTab,
} from "@/src/features/projects/lib/project-tabs";
import type { ProjectTab } from "@/src/features/projects/lib/project-tabs";
import type { Notification } from "../types/notification";
import { notificationHref } from "./notificationHref";

// Where an unread notification shows up as an "update" dot: its project, the
// project tab it belongs to, and — when it's about one record on that tab —
// that record's id. Derived from notificationHref so the dot sits exactly
// where clicking the notification would take the user.
export interface UpdateTarget {
  notificationId: number;
  projectId: string;
  tab: ProjectTab;
  // milestones/payments: milestone id; changes: change request id;
  // disputes: dispute id. null = the update belongs to the tab as a whole.
  itemId: string | null;
}

function idAfter(url: string | null | undefined, segment: string): string | null {
  return url?.match(new RegExp(`/${segment}/(\\d+)`))?.[1] ?? null;
}

export function updateTarget(notification: Notification): UpdateTarget {
  const href = notificationHref(notification);
  const [path, query = ""] = href.split("?");
  // "/projects/{id}/{section}/{sectionId}"
  const [, , hrefProjectId, section, sectionId] = path.split("/");
  const tabParam = new URLSearchParams(query).get("tab");

  const tab: ProjectTab =
    section === "milestones" ? "milestones" : isProjectTab(tabParam) ? tabParam : DEFAULT_PROJECT_TAB;

  const milestoneId =
    notification.milestoneId != null ? String(notification.milestoneId) : null;

  const itemId =
    tab === "milestones"
      ? (sectionId ?? milestoneId)
      : tab === "payments"
        ? (idAfter(notification.actionUrl, "milestones") ?? milestoneId)
        : tab === "changes"
          ? idAfter(notification.actionUrl, "change-requests")
          : tab === "disputes"
            ? idAfter(notification.actionUrl, "disputes")
            : null;

  return {
    notificationId: notification.notificationId,
    projectId: hrefProjectId ?? String(notification.projectId),
    tab,
    itemId,
  };
}
