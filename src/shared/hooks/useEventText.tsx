"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useStatusLabel } from "./useStatusLabel";

// Activity entries and notifications arrive with English text written by the
// backend, plus an eventType code. English shows the text as sent; other
// languages build their own wording from the eventType (and whatever
// structured fields the entry carries). An eventType with no translation
// yet falls back to the English text, so nothing is ever hidden.
// The backend's English text names its subject in single quotes ("Deliverable
// accepted for 'stage1'", "approved change request 'new change'"), so that
// name can be carried into the translated wording. No quoted name → none.
function quotedName(text: string | null | undefined): string | null {
  return text?.match(/(?:^|\s)'([^']+)'(?=[\s.,:;!?]|$)/)?.[1] ?? null;
}

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
      // milestone: a known title; otherwise the quoted name in `nameSource`
      // (defaults to the English text itself) is used.
      extra: {
        milestone?: string | null;
        version?: number | null;
        nameSource?: string | null;
      } = {},
    ): ReactNode {
      const key = `sentences.${eventType}`;
      if (!eventType || !has(key)) return fallback ?? "";

      let text = t(key as "sentences.ContractApproved");
      if (extra.version) text = t("withVersion", { text, version: extra.version });
      const name = extra.milestone || quotedName(extra.nameSource ?? fallback);
      if (name) {
        return t.rich("withMilestone", {
          text,
          milestone: name,
          bdi: (chunks) => <bdi>{chunks}</bdi>,
        });
      }
      return text;
    },

    notificationTitle(eventType: string, fallback: string): ReactNode {
      const key = `notificationTitles.${eventType}`;
      if (has(key)) return t(key as "notificationTitles.ProjectCompleted");

      // Chat notifications: the title is "New message from {sender}" and the
      // message is the chat text itself, which stays as written.
      const sender = translates ? fallback.match(/^New message from (.+)$/)?.[1] : null;
      if (sender) {
        return t.rich("newMessageFrom", {
          name: sender,
          bdi: (chunks) => <bdi>{chunks}</bdi>,
        });
      }
      return fallback;
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
