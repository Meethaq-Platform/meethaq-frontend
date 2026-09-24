import type { Locale } from "@/src/i18n/config";
import { GREGORIAN, LATIN_DIGITS } from "@/src/i18n/formats";

// Formatting helpers take the active locale (default English, so existing
// output is unchanged). Components get them bound to the current language
// through useFormat().
//
// Arabic uses the plain `ar` locale with Western digits and the Gregorian
// calendar pinned explicitly (glossary S4/S5).
function intlLocale(locale: Locale): string {
  return locale === "ar" ? "ar" : "en-US";
}

function localeOptions(locale: Locale) {
  return locale === "ar" ? { ...LATIN_DIGITS, ...GREGORIAN } : {};
}

// Currency keeps the `$1,500.00` shape in every language (glossary S6); inside
// Arabic sentences, wrap the result in <bdi> or ltrIsolate().
export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

// Wraps text in Unicode LTR isolates, for amounts/IDs embedded in plain-text
// Arabic messages (toasts, aria-labels) where <bdi> can't be used.
export function ltrIsolate(text: string): string {
  return `⁦${text}⁩`;
}

// Wraps text in first-strong isolates, for user-provided names (files,
// people) embedded in plain-text messages: the name keeps its own direction
// without reordering the sentence around it.
export function bidiIsolate(text: string): string {
  return `⁨${text}⁩`;
}

export function formatDate(value: string, locale: Locale = "en"): string {
  return new Date(value).toLocaleDateString(intlLocale(locale), {
    ...localeOptions(locale),
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: string, locale: Locale = "en"): string {
  return new Date(value).toLocaleString(intlLocale(locale), {
    ...localeOptions(locale),
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const RELATIVE_UNITS: { limit: number; divisor: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { limit: 60, divisor: 1, unit: "second" },
  { limit: 3600, divisor: 60, unit: "minute" },
  { limit: 86400, divisor: 3600, unit: "hour" },
  { limit: 604800, divisor: 86400, unit: "day" },
  { limit: 2629800, divisor: 604800, unit: "week" },
  { limit: 31557600, divisor: 2629800, unit: "month" },
  { limit: Infinity, divisor: 31557600, unit: "year" },
];

const relativeTimeFormatters: Partial<Record<Locale, Intl.RelativeTimeFormat>> = {};

function relativeTimeFormatter(locale: Locale) {
  return (relativeTimeFormatters[locale] ??= new Intl.RelativeTimeFormat(intlLocale(locale), {
    ...(locale === "ar" ? LATIN_DIGITS : {}),
    numeric: "auto",
  }));
}

// Hand-rolled since no date library is installed — "2 days ago" / "in 3 hours".
export function getRelativeTime(
  value: string,
  now: Date = new Date(),
  locale: Locale = "en",
): string {
  const diffSeconds = (new Date(value).getTime() - now.getTime()) / 1000;
  const absSeconds = Math.abs(diffSeconds);

  const { divisor, unit } = RELATIVE_UNITS.find((entry) => absSeconds < entry.limit)!;

  return relativeTimeFormatter(locale).format(Math.round(diffSeconds / divisor), unit);
}

export interface TimeRemaining {
  isOverdue: boolean;
  // Localized relative time, e.g. "in 3 days" / "2 hours ago". The
  // surrounding "Due …" / "Overdue …" wording lives in the messages
  // (common.time), composed by useFormat().timeRemaining.
  relative: string;
}

export function getTimeRemaining(
  deadline: string,
  now: Date = new Date(),
  locale: Locale = "en",
): TimeRemaining {
  const diffMs = new Date(deadline).getTime() - now.getTime();

  return { isOverdue: diffMs < 0, relative: getRelativeTime(deadline, now, locale) };
}
