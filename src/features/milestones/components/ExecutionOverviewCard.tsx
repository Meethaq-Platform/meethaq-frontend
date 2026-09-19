"use client";

import { CheckCircle2 } from "lucide-react";
import { useExecutionOverview } from "../hooks/useExecutionOverview";
import Spinner from "@/src/shared/components/Spinner";

interface ExecutionOverviewCardProps {
  projectId: string;
}

// Module 7's summary card — served directly by GET /projects/{id}/overview,
// a single shared endpoint (both roles), so no client-side computation.
export function ExecutionOverviewCard({ projectId }: ExecutionOverviewCardProps) {
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
    { label: "Total Milestones", value: overview.totalMilestones },
    { label: "Accepted", value: overview.acceptedMilestones },
    { label: "Awaiting Review", value: overview.awaitingReviewMilestones },
    { label: "Requiring Revision", value: overview.revisionRequestedMilestones },
    { label: "Overdue", value: overview.overdueMilestones },
  ];

  return (
    <div className="bg-surface p-6 border border-border rounded-2xl">
      <h2 className="mb-4 font-semibold text-text-primary text-base">
        Execution Overview
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
          All Deliverables Accepted
        </div>
      )}
    </div>
  );
}
