import type { ProjectTab } from "@/src/features/projects/lib/project-tabs";

// Some dashboard actions are carried out somewhere other than where their
// record lives — a payment reminder is a message to the client, so it opens
// the project chat rather than the Payments tab. Keyed by the backend's English
// action label (the only signal the DTOs give for what the button does).
const tabsByActionLabel: Record<string, ProjectTab> = {
  "send payment reminder": "chat",
};

export function tabForActionLabel(label: string | null | undefined) {
  return tabsByActionLabel[(label ?? "").trim().toLowerCase()];
}
