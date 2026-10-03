import {
  projectHref,
  projectTabFor,
} from "@/src/features/projects/lib/project-tabs";
import type { ProjectTab } from "@/src/features/projects/lib/project-tabs";
import type { Notification } from "../types/notification";

// Sections the backend links to as their own pages, which live as tabs on
// the project detail page here.
const sectionTabs: Record<string, ProjectTab> = {
  payments: "payments",
  "change-requests": "changes",
  disputes: "disputes",
  messages: "chat",
};

// The backend's actionUrl follows its own route layout
// (/projects/1/disputes/7, /client/projects/1/milestones/2/review, ...),
// most of which has no page here. Maps it onto the routes that exist; a
// shape it doesn't recognize falls back to the project tab for the event.
export function notificationHref(notification: Notification): string {
  const fallback = projectHref(
    notification.projectId,
    projectTabFor(notification.eventType),
  );

  const match = notification.actionUrl?.match(/^\/(?:client\/)?projects\/(\d+)(\/[^?#]*)?/);
  if (!match) return fallback;

  const [, projectId, rest = ""] = match;
  const [section, sectionId, subsection] = rest.split("/").filter(Boolean);

  if (!section) return projectHref(projectId);
  if (section === "contract") return `/projects/${projectId}/contract`;
  if (section === "milestones" && sectionId) {
    // The milestone page has no payments section; those live on the tab.
    return subsection === "payments"
      ? projectHref(projectId, "payments")
      : `/projects/${projectId}/milestones/${sectionId}`;
  }

  const tab = sectionTabs[section];
  return tab ? projectHref(projectId, tab) : fallback;
}
