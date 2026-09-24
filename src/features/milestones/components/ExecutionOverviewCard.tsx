"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useExecutionOverview } from "../hooks/useExecutionOverview";
import Spinner from "@/src/shared/components/Spinner";

interface ExecutionOverviewCardProps {
  projectId: string;
}

// Module 7's summary card — served directly by GET /projects/{id}/overview,
// a single shared endpoint (both roles), so no client-side computation.
export function ExecutionOverviewCard({ projectId }: ExecutionOverviewCardProps) {
  const t = useTranslations("milestones.overview");
  const { data: overview, isLoading } = useExecutionOverview(projectId);

  if (isLoading) {
    return (
      <div className="bg-surface p-6 border border-border rounded-2xl">
        <Spinner size={20} />
      </div>
    );
  }

  if (!overview || overview.totalMilestones === 0) {
    return null;
  }

  const stats = [
    { label: t("total"), value: overview.totalMilestones },
    { label: t("accepted"), value: overview.acceptedMilestones },
    { label: t("awaitingReview"), value: overview.awaitingReviewMilestones },
    { label: t("revisionRequested"), value: overview.revisionRequestedMilestones },
    { label: t("overdue"), value: overview.overdueMilestones },
  ];

  return (
    <div className="bg-surface p-6 border border-border rounded-2xl">
      <h2 className="mb-4 font-semibold text-text-primary text-base">
        {t("title")}
      </h2>

      <div className="gap-4 grid grid-cols-2 sm:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-numbers font-semibold text-text-primary text-xl">
              {stat.value}
            </p>
            <p className="text-text-secondary text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {overview.allDeliverablesAccepted && (
        <div className="flex items-center gap-2 bg-success-muted mt-4 p-3 rounded-xl text-success text-sm">
          <CheckCircle2 size={16} />
          {t("allAccepted")}
        </div>
      )}
    </div>
  );
}
