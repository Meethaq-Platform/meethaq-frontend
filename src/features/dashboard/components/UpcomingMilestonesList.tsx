"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useApiText } from "../hooks/useApiText";
import Tabs from "@/src/shared/components/Tabs";
import EmptyState from "@/src/shared/components/EmptyState";
import RelativeTime from "@/src/shared/components/RelativeTime";
import { formatCurrency } from "@/src/shared/lib/format";
import type { UpcomingMilestoneItem } from "../types/dashboard";

type RangeFilter = "7" | "30" | "overdue";

interface UpcomingMilestonesListProps {
  items: UpcomingMilestoneItem[];
}

// Feature 17: filters are applied client-side over the same already-fetched
// list (it's a "top N" preview, not a paginated source of truth) — Overdue
// and upcoming are always shown as separate buckets per the sprint's
// deadline rules, never merged into one undifferentiated list.
export default function UpcomingMilestonesList({ items }: UpcomingMilestonesListProps) {
  const t = useTranslations("dashboard.upcoming");
  const apiText = useApiText();
  const tDashboard = useTranslations("dashboard");
  const [range, setRange] = useState<RangeFilter>("30");

  const filtered = items.filter((item) => {
    if (range === "overdue") return item.isOverdue;
    if (item.isOverdue) return false;
    const limit = range === "7" ? 7 : 30;
    return item.daysUntilDue <= limit;
  });

  return (
    <div>
      <div className="mb-3">
        <Tabs
          value={range}
          onChange={setRange}
          options={[
            { value: "7", label: t("next7") },
            { value: "30", label: t("next30") },
            { value: "overdue", label: t("overdue") },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={CalendarClock} title={t("empty")} />
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((item) => (
            <li
              key={item.milestoneId}
              className="flex flex-wrap items-center gap-3 p-3 border border-border rounded-xl"
            >
              <div className="flex-1 min-w-0">
                <p dir="auto" className="font-medium text-text-primary text-sm truncate">
                  {item.milestoneTitle}
                </p>
                <p className="text-text-secondary text-xs">
                  <bdi>{item.projectName}</bdi>
                  {item.counterpartyName ? (
                    <>
                      {" · "}
                      <bdi>{item.counterpartyName}</bdi>
                    </>
                  ) : null}
                  {" · "}
                  <bdi>{formatCurrency(item.agreedAmount, item.currency ?? "USD")}</bdi>
                </p>
                <p className={`mt-1 text-xs ${item.isOverdue ? "text-danger font-medium" : "text-text-secondary"}`}>
                  {t.rich(item.isOverdue ? "overdueWasDue" : "due", {
                    time: () => <RelativeTime value={item.dueDateUtc} />,
                  })}
                </p>
              </div>

              {/* The backend's actionNavigationUrl points at a flat
                  /milestones page that doesn't exist here — the real page is
                  nested under the project, so it's built from the ids we
                  already have instead of trusting that field. */}
              <Link
                href={`/projects/${item.projectId}/milestones/${item.milestoneId}`}
                className="bg-surface-muted hover:bg-border/60 px-3 rounded-lg h-9 font-semibold text-text-primary text-xs whitespace-nowrap leading-9 transition shrink-0"
              >
                {item.actionLabel ? apiText(item.actionLabel) : tDashboard("open")}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
