"use client";

import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import RelativeTime from "@/src/shared/components/RelativeTime";

interface LastUpdatedBarProps {
  lastUpdatedAtUtc: string;
  isRefreshing: boolean;
  isStale: boolean;
  onRefresh: () => void;
}

// Module 17: shows when the snapshot was generated and lets the user force a
// refresh; `isStale` marks a previously-good snapshot whose refresh failed,
// so it never gets mistaken for a fresh zero balance.
export default function LastUpdatedBar({
  lastUpdatedAtUtc,
  isRefreshing,
  isStale,
  onRefresh,
}: LastUpdatedBarProps) {
  const t = useTranslations("dashboard");
  return (
    <div className="flex flex-wrap justify-between items-center gap-2 text-text-secondary text-xs">
      <span>
        {isStale ? (
          <span className="font-medium text-warning">
            {t("staleData")}
          </span>
        ) : (
          t.rich("lastUpdated", { time: () => <RelativeTime value={lastUpdatedAtUtc} /> })
        )}
      </span>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-1.5 hover:text-text-primary disabled:opacity-60 font-medium transition disabled:cursor-not-allowed"
      >
        <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
        {t("refresh")}
      </button>
    </div>
  );
}
