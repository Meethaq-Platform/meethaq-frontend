"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, History } from "lucide-react";
import { useTranslations } from "next-intl";

import { useActivity } from "../hooks/useActivity";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import EmptyState from "@/src/shared/components/EmptyState";
import { useFormat } from "@/src/shared/hooks/useFormat";

interface ActivityTabProps {
  projectId: string;
}

const COLLAPSED_COUNT = 5;

// Read-only for both participants — no edit/delete, matches Module 6's rule.
export function ActivityTab({ projectId }: ActivityTabProps) {
  const t = useTranslations("activity");
  const format = useFormat();
  const { data: entries, isLoading, isError, refetch } = useActivity(projectId);
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState message={t("loadFailed")} onRetry={() => refetch()} />
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <EmptyState
        icon={History}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
      />
    );
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const visible = showAll ? sorted : sorted.slice(0, COLLAPSED_COUNT);
  const remaining = sorted.length - visible.length;

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      {visible.map((entry) => {
        // No dedicated deep link on the backend DTO — best-effort link to
        // the related milestone's detail page when one is present.
        const linkUrl = entry.milestoneId
          ? `/projects/${projectId}/milestones/${entry.milestoneId}`
          : null;

        const content = (
          <div className="flex justify-between items-start gap-3 p-4 border-border border-b last:border-b-0">
            <div>
              {/* Description and statuses come from the API (English until it sends codes). */}
              <p dir="auto" className="font-medium text-text-primary text-sm">{entry.description}</p>
              <p className="mt-0.5 text-text-secondary text-xs">
                {entry.performedByName} · {format.dateTime(entry.createdAt)}
              </p>
              {entry.fromStatus && entry.toStatus && (
                <p className="mt-1 text-text-secondary text-xs">
                  {entry.fromStatus} → {entry.toStatus}
                </p>
              )}
            </div>
          </div>
        );

        return linkUrl ? (
          <Link key={entry.activityId} href={linkUrl} className="block hover:bg-surface-muted transition">
            {content}
          </Link>
        ) : (
          <div key={entry.activityId}>{content}</div>
        );
      })}

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="flex justify-center items-center gap-1.5 hover:bg-surface-muted py-3 border-border border-t w-full font-medium text-primary text-sm transition"
        >
          {t("showMore", { count: remaining })}
          <ChevronDown size={14} />
        </button>
      )}
    </div>
  );
}
