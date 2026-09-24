"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

import { formatDateTime, getRelativeTime } from "@/src/shared/lib/format";

interface RelativeTimeProps {
  value: string;
  className?: string;
}

// Label is derived directly from `value` on every render (not stored state)
// — the effect only forces a periodic re-render via the tick counter, so
// open screens (chat, notifications) don't show a stale "2 minutes ago"
// indefinitely without a full refetch.
export default function RelativeTime({ value, className }: RelativeTimeProps) {
  const [, setTick] = useState(0);
  const locale = useLocale();

  useEffect(() => {
    const interval = setInterval(() => setTick((tick) => tick + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <time dateTime={value} className={className} // English keeps the browser-default tooltip format it always had.
      title={locale === "ar" ? formatDateTime(value, locale) : new Date(value).toLocaleString()}>
      {getRelativeTime(value, undefined, locale)}
    </time>
  );
}
