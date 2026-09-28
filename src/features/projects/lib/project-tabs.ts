// Tabs on the project detail page (both roles). The active tab lives in the
// URL as ?tab=<value> so other pages can link straight to a section and
// refresh/share keeps it; "overview" is the default and is left out of the URL.
export const PROJECT_TABS = [
  "overview",
  "milestones",
  "payments",
  "changes",
  "disputes",
  "chat",
  "activity",
] as const;

export type ProjectTab = (typeof PROJECT_TABS)[number];

export const DEFAULT_PROJECT_TAB: ProjectTab = "overview";

export function isProjectTab(value: string | null | undefined): value is ProjectTab {
  return (PROJECT_TABS as readonly string[]).includes(value ?? "");
}

export function projectHref(projectId: string | number, tab?: ProjectTab) {
  return !tab || tab === DEFAULT_PROJECT_TAB
    ? `/projects/${projectId}`
    : `/projects/${projectId}?tab=${tab}`;
}

// Backend event and entity types are plain strings that share a prefix per
// area (PaymentRecorded, ChangeRequestApproved, DisputeOpened...). Matching on
// the prefix picks the tab where that record lives; anything unrecognized —
// including contract events, whose card sits on the overview — stays there.
const tabPrefixes: [prefix: string, tab: ProjectTab][] = [
  ["payment", "payments"],
  ["changerequest", "changes"],
  ["dispute", "disputes"],
  ["milestone", "milestones"],
  ["deliverable", "milestones"],
  ["submission", "milestones"],
  ["revision", "milestones"],
  ["review", "milestones"],
  ["newprojectmessage", "chat"],
  ["message", "chat"],
];

export function projectTabFor(type: string | null | undefined): ProjectTab {
  const normalized = type?.replace(/[^a-z]/gi, "").toLowerCase() ?? "";
  return (
    tabPrefixes.find(([prefix]) => normalized.startsWith(prefix))?.[1] ??
    DEFAULT_PROJECT_TAB
  );
}
