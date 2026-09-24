import { useLocale, useTranslations } from "next-intl";

// The dashboard API sends some display text in English (badges such as
// "Approaching Deadline", buttons such as "Submit Work"). English shows it as
// sent; other languages look the phrase up in dashboard.apiText, and a phrase
// with no translation yet is shown as sent rather than hidden.
function toKey(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function useApiText() {
  const locale = useLocale();
  const t = useTranslations("dashboard.apiText");

  return (text: string | null | undefined): string => {
    if (!text || locale === "en") return text ?? "";
    const key = toKey(text) as "open";
    return t.has(key) ? t(key) : text;
  };
}
