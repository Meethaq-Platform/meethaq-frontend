import { useTranslations } from "next-intl";

// Groups under `status` in the message catalogs (glossary §4).
export type StatusGroup =
  | "project"
  | "projectContract"
  | "milestoneExecution"
  | "milestonePayment"
  | "dispute"
  | "disputeCategory"
  | "changeRequest"
  | "evidenceSource";

// Returns a labeler for one status group. Statuses come from the API, so an
// unrecognized value falls back to `fallback` (or the raw value) instead of
// breaking. No "use client": badges also render inside server components.
export function useStatusLabel(group: StatusGroup) {
  const t = useTranslations("status");

  return (value: string | number, fallback?: string): string => {
    const key = `${group}.${value}` as "project.Draft";
    return t.has(key) ? t(key) : (fallback ?? String(value));
  };
}
