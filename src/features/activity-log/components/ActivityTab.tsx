"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, History } from "lucide-react";
import { useTranslations } from "next-intl";

import { useActivity } from "../hooks/useActivity";
import { useActivityUpdates } from "../hooks/useActivityUpdates";
import { useEventText } from "@/src/shared/hooks/useEventText";
import { useMilestoneTitles } from "../hooks/useMilestoneTitles";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import EmptyState from "@/src/shared/components/EmptyState";
import { useFormat } from "@/src/shared/hooks/useFormat";
import UpdateDot from "@/src/shared/components/UpdateDot";

interface ActivityTabProps {
  projectId: string;
}

const COLLAPSED_COUNT = 5;

// Read-only for both participants — no edit/delete, matches Module 6's rule.
export function ActivityTab({ projectId }: ActivityTabProps) {
  const t = useTranslations("activity");
  const format = useFormat();
  const { data: entries, isLoading, isError, refetch } = useActivity(projectId);
  const eventText = useEventText();
  const milestoneTitles = useMilestoneTitles(projectId, eventText.translates);
  const [showAll, setShowAll] = useState(false);
  const activityUpdates = useActivityUpdates(projectId);
  const { markSeen } = activityUpdates;

  // What was "last seen" when the tab opened: entries after it keep their
  // dot while the user is here, even though opening the tab marks them seen
  // (which clears the tab's own dot right away).
  const [opened, setOpened] = useState<{ since: number } | null>(null);
  if (opened === null && activityUpdates.seenAt !== null) {
    setOpened({ since: activityUpdates.seenAt });
  }

  // Re-runs as new entries arrive while the tab is open.
  useEffect(() => {
    if (opened) markSeen();
  }, [opened, markSeen]);

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
            <div className="flex items-start gap-2 min-w-0">
              {opened && activityUpdates.isNew(entry, opened.since) && (
                <UpdateDot className="mt-1.5" />
              )}
              <div className="min-w-0">
                {/* The API's description is English; other languages build it from eventType. */}
                <p dir="auto" className="font-medium text-text-primary text-sm">
                  {eventText.sentence(entry.eventType, entry.description, {
                    milestone: entry.milestoneId ? milestoneTitles.get(entry.milestoneId) : null,
                    version: entry.submissionVersion,
                  })}
                </p>
                <p className="mt-0.5 text-text-secondary text-xs">
                  <bdi>{entry.performedByName}</bdi> · {format.dateTime(entry.createdAt)}
                </p>
                {entry.fromStatus && entry.toStatus && (
                  <p className="mt-1 text-text-secondary text-xs">
                    {eventText.status(entry.fromStatus)} <span className="rtl-flip inline-block">→</span>{" "}
                    {eventText.status(entry.toStatus)}
                  </p>
                )}
              </div>
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
