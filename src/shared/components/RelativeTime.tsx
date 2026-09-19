"use client";

import { useEffect, useState } from "react";
import { getRelativeTime } from "@/src/shared/lib/format";

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

  useEffect(() => {
    const interval = setInterval(() => setTick((tick) => tick + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <time dateTime={value} className={className} title={new Date(value).toLocaleString()}>
      {getRelativeTime(value)}
    </time>
  );
}
