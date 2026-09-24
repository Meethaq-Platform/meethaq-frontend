"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  formatCompactNumber,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatLongDate,
  formatMonthYear,
  getRelativeTime,
  getTimeRemaining,
} from "../lib/format";

// Formatting bound to the active language.
export function useFormat() {
  const locale = useLocale();
  const t = useTranslations("common.time");

  return useMemo(
    () => ({
      currency: formatCurrency,
      date: (value: string) => formatDate(value, locale),
      dateTime: (value: string) => formatDateTime(value, locale),
      longDate: (value: string) => formatLongDate(value, locale),
      monthYear: (year: number, month: number) => formatMonthYear(year, month, locale),
      compact: (value: number) => formatCompactNumber(value, locale),
      relative: (value: string, now?: Date) => getRelativeTime(value, now, locale),
      timeRemaining: (deadline: string, now?: Date) => {
        const { isOverdue, relative } = getTimeRemaining(deadline, now, locale);
        return {
          isOverdue,
          label: isOverdue ? t("overdueWasDue", { relative }) : t("due", { relative }),
        };
      },
    }),
    [locale, t],
  );
}
