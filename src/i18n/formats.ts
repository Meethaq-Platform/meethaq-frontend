import type { Formats } from "next-intl";

// Arabic mode uses Western digits (0123), never Arabic-Indic (٠١٢٣). Whether
// a runtime defaults to one or the other varies (plain "ar" is Western in
// current ICU, but ar-EG/ar-SA/ar-JO are Arabic-Indic), so every format here
// sets numberingSystem explicitly instead of relying on locale defaults.
//
// Phase 3 notes:
// - Format numbers/dates through these named formats, e.g.
//   format.number(n, "decimal") or `{count, number, integer}` in messages,
//   including inside plural branches. Never use `#`, a bare `{count}` or
//   `{count, number}`: those use the locale default. pnpm i18n:check
//   enforces this.
// - Raw Intl calls (src/shared/lib/format.ts, charts) must spread
//   LATIN_DIGITS into their options when they switch to the active locale.
export const LATIN_DIGITS = { numberingSystem: "latn" } as const;

// Gregorian only (glossary S5): some Arabic locales default to the Hijri
// calendar, so date formats pin it rather than inherit it.
export const GREGORIAN = { calendar: "gregory" } as const;

export const formats = {
  number: {
    integer: { ...LATIN_DIGITS, maximumFractionDigits: 0 },
    decimal: { ...LATIN_DIGITS, maximumFractionDigits: 2 },
    compact: { ...LATIN_DIGITS, notation: "compact" },
    percent: { ...LATIN_DIGITS, style: "percent" },
  },
  dateTime: {
    short: { ...LATIN_DIGITS, ...GREGORIAN, day: "numeric", month: "short", year: "numeric" },
    long: { ...LATIN_DIGITS, ...GREGORIAN, day: "numeric", month: "long", year: "numeric" },
    dateTime: {
      ...LATIN_DIGITS,
      ...GREGORIAN,
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  },
} satisfies Formats;
