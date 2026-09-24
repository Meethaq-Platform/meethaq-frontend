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
      const key = toKey(message) as "operation_completed_successfully";
      if (key && t.has(key)) return { text: t(key) };
      return kind === "success"
        ? { text: tToasts("successGeneric") }
        : { text: tToasts("errorGeneric"), detail: message };
    },
    [locale, t, tToasts],
  );
}
