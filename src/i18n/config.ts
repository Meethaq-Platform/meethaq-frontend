export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export type Direction = "ltr" | "rtl";

export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

// Arabic is gated until its strings are translated (phase 3): with the flag
// off, every request renders English/LTR regardless of cookie or browser
// language, and the language switcher is hidden. Set
// NEXT_PUBLIC_ENABLE_ARABIC=true in .env.local to work on RTL.
export const isArabicEnabled = process.env.NEXT_PUBLIC_ENABLE_ARABIC === "true";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function getDirection(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr";
}
