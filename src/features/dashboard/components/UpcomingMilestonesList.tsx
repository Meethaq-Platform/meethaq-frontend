"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
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
            { value: "7", label: "Next 7 Days" },
            { value: "30", label: "Next 30 Days" },
            { value: "overdue", label: "Overdue" },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No milestones in this range." />
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((item) => (
            <li
              key={item.milestoneId}
              className="flex flex-wrap items-center gap-3 p-3 border border-border rounded-xl"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary text-sm truncate">
                  {item.milestoneTitle}
                </p>
                <p className="text-text-secondary text-xs">
                  {item.projectName}
                  {item.counterpartyName ? ` · ${item.counterpartyName}` : ""}
                  {" · "}
                  {formatCurrency(item.agreedAmount, item.currency ?? "USD")}
                </p>
                <p className={`mt-1 text-xs ${item.isOverdue ? "text-danger font-medium" : "text-text-secondary"}`}>
                  {item.isOverdue ? "Overdue — was due " : "Due "}
                  <RelativeTime value={item.dueDateUtc} />
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
                {item.actionLabel ?? "Open"}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
