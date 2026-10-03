"use client";

import { useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";

export interface ApiMessageText {
  text: string;
  // The message as sent, kept as a detail line when it couldn't be
  // translated (it may carry the actual reason, e.g. a validation error).
  detail?: string;
}

function toKey(message: string) {
  return message
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

// Messages that embed a value (a milestone title, …) can't be looked up by
// key, so they're matched by pattern and the value is passed through.
const PATTERNS: {
  pattern: RegExp;
  key: "milestone_submitted_for_review";
  param: string;
}[] = [
  {
    pattern: /^Cannot approve change request: milestone '(.+)' is currently submitted for review\.?$/,
    key: "milestone_submitted_for_review",
    param: "milestone",
  },
];

function translate(
  message: string,
  t: ReturnType<typeof useTranslations<"apiMessages">>,
): string | null {
  for (const { pattern, key, param } of PATTERNS) {
    const match = message.trim().match(pattern);
    if (match) return t(key, { [param]: match[1] });
  }
  const key = toKey(message) as "operation_completed_successfully";
  return key && t.has(key) ? t(key) : null;
}

// For errors shown inline in a form or dialog. Same lookup as useApiMessage,
// but an untranslated message falls back to the caller's own (already
// translated, more specific) line instead of a generic one, so an Arabic
// form never shows the API's English text.
export function useErrorText() {
  const locale = useLocale();
  const t = useTranslations("apiMessages");

  return useCallback(
    (error: unknown, fallback: string): string => {
      if (!(error instanceof Error) || !error.message) return fallback;
      if (locale === "en") return error.message;
      return translate(error.message, t) ?? fallback;
    },
    [locale, t],
  );
}

// Messages shown to the user from API responses and the service layer
// ("Operation completed successfully.", "Failed to record payment.") are
// English. English shows them as sent; other languages use the translation
// in apiMessages, or a generic line when there's none.
export function useApiMessage() {
  const locale = useLocale();
  const t = useTranslations("apiMessages");
  const tToasts = useTranslations("common.toasts");

  return useCallback(
    (message: string, kind: "success" | "error"): ApiMessageText => {
      if (locale === "en") return { text: message };
      const translated = translate(message, t);
      if (translated) return { text: translated };
      return kind === "success"
        ? { text: tToasts("successGeneric") }
        : { text: tToasts("errorGeneric"), detail: message };
    },
    [locale, t, tToasts],
  );
}
