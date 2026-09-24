import type { Formats } from "next-intl";

// Arabic mode uses Western digits (0123), never Arabic-Indic (٠١٢٣). Intl's
// default numbering system for "ar" is Arabic-Indic, so every format here sets
// numberingSystem explicitly instead of relying on locale defaults.
//
// Phase 3 notes:
// - Format numbers/dates through these named formats, e.g.
//   format.number(n, "decimal") or `{count, number, integer}` in messages.
//   A bare `{count, number}` in an ICU message falls back to the locale
//   default and would render Arabic-Indic digits.
// - Raw Intl calls (src/shared/lib/format.ts, charts) must spread
//   LATIN_DIGITS into their options when they switch to the active locale.
export const LATIN_DIGITS = { numberingSystem: "latn" } as const;

export const formats = {
  number: {
    integer: { ...LATIN_DIGITS, maximumFractionDigits: 0 },
    decimal: { ...LATIN_DIGITS, maximumFractionDigits: 2 },
    compact: { ...LATIN_DIGITS, notation: "compact" },
    percent: { ...LATIN_DIGITS, style: "percent" },
  },
  dateTime: {
    short: { ...LATIN_DIGITS, day: "numeric", month: "short", year: "numeric" },
    long: { ...LATIN_DIGITS, day: "numeric", month: "long", year: "numeric" },
    dateTime: {
      ...LATIN_DIGITS,
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  },
} satisfies Formats;
