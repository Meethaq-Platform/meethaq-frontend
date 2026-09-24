"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useStatusLabel } from "./useStatusLabel";

// Activity entries and notifications arrive with English text written by the
// backend, plus an eventType code. English shows the text as sent; other
// languages build their own wording from the eventType (and whatever
// structured fields the entry carries). An eventType with no translation
// yet falls back to the English text, so nothing is ever hidden.
export function useEventText() {
  const locale = useLocale();
  const t = useTranslations("events");
  const statusLabel = useStatusLabel("milestoneExecution");
  const translates = locale !== "en";

  const has = (key: string) => translates && t.has(key as "sentences.ContractApproved");

  return {
    translates,

    sentence(
      eventType: string | null | undefined,
      fallback: string | null | undefined,
      extra: { milestone?: string | null; version?: number | null } = {},
    ): ReactNode {
      const key = `sentences.${eventType}`;
      if (!eventType || !has(key)) return fallback ?? "";

      let text = t(key as "sentences.ContractApproved");
      if (extra.version) text = t("withVersion", { text, version: extra.version });
      if (extra.milestone) {
        return t.rich("withMilestone", {
          text,
          milestone: extra.milestone,
          bdi: (chunks) => <bdi>{chunks}</bdi>,
        });
      }
      return text;
    },

    notificationTitle(eventType: string, fallback: string): string {
      const key = `notificationTitles.${eventType}`;
      return has(key) ? t(key as "notificationTitles.ProjectCompleted") : fallback;
    },

    // Whether the English notification message should be kept as a detail
    // line, because the translated wording can't carry its names.
    isTranslated(eventType: string | null | undefined): boolean {
      return Boolean(eventType) && has(`sentences.${eventType}`);
    },

    status(value: string): string {
      return translates ? statusLabel(value) : value;
    },
  };
}
