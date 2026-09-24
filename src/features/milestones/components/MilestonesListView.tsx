import Link from "next/link";
import { ChevronRight, ListChecks } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormat } from "@/src/shared/hooks/useFormat";

import type { MilestoneExecutionDetail } from "../types/milestone";
import { MilestoneStatusBadge } from "./MilestoneStatusBadge";
import { ReviewDeadlineBadge } from "@/src/features/submissions/components/ReviewDeadlineBadge";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import EmptyState from "@/src/shared/components/EmptyState";
import { formatCurrency } from "@/src/shared/lib/format";

interface MilestonesListViewProps {
  projectId: string;
  milestones: MilestoneExecutionDetail[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

// Shared, role-agnostic presentation — both the freelancer and client
// milestones lists render through this, each sourcing `milestones` from
// their own role-scoped composition hook (useFreelancerMilestonesList /
// useClientMilestonesList).
export function MilestonesListView({
  projectId,
  milestones,
  isLoading,
  isError,
  onRetry,
}: MilestonesListViewProps) {
  const t = useTranslations("milestones.list");
  const format = useFormat();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  if (isError) {
    return <ErrorState message={t("loadFailed")} onRetry={onRetry} />;
  }

  if (milestones.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
      />
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      {milestones.map((milestone) => (
        <Link
          key={milestone.milestoneId}
          href={`/projects/${projectId}/milestones/${milestone.milestoneId}`}
          className="group flex sm:flex-row flex-col justify-between items-start sm:items-center gap-3 hover:bg-surface-muted active:bg-border/40 p-4 border-border border-b last:border-b-0 transition"
        >
          <div className="flex-1 min-w-0">
            <h3 dir="auto" className="font-semibold text-text-primary group-hover:text-primary text-sm transition-colors">
              {milestone.title}
            </h3>
            <p className="mt-1 text-text-secondary text-xs">
              {t("due", { date: format.date(milestone.dueDate) })} ·{" "}
              <bdi>{formatCurrency(milestone.calculatedAmount)}</bdi>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {milestone.latestSubmission &&
              milestone.latestSubmission.reviewFeedback === null && (
                <ReviewDeadlineBadge
                  reviewDeadline={milestone.latestSubmission.reviewDeadline}
                  isOverdue={milestone.latestSubmission.isOverdue}
                />
              )}
            <MilestoneStatusBadge status={milestone.executionStatus} />

            <ChevronRight
              size={16}
              className="rtl-flip text-text-secondary group-hover:text-primary transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 shrink-0"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
