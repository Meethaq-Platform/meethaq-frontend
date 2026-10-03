"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useClientMilestone } from "../hooks/useClientMilestone";
import { useClientSubmissions } from "../hooks/useClientSubmissions";
import { MilestoneDetailShell } from "@/src/features/milestones/components/MilestoneDetailShell";
import { SubmissionHistoryList } from "@/src/features/submissions/components/SubmissionHistoryList";
import { useClientProject } from "@/src/features/client-projects/hooks/useClientProject";
import { usePageTitle } from "@/src/shared/hooks/usePageTitle";
import { useClearUpdates } from "@/src/features/notifications/hooks/useProjectUpdates";
import { AcceptDeliverableButton } from "./AcceptDeliverableButton";
import { RequestRevisionModal } from "./RequestRevisionModal";
import { RequestMilestoneChangeButton } from "@/src/features/change-requests/components/RequestMilestoneChangeButton";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import { projectHref } from "@/src/features/projects/lib/project-tabs";

interface MilestoneReviewPageProps {
  projectId: string;
  milestoneId: string;
}

// Client's milestone-detail body. Server-side enforcement that only the
// project's assigned client can accept/request-revision is a backend
// responsibility — this component only controls which actions are *shown*.
export function MilestoneReviewPage({
  projectId,
  milestoneId,
}: MilestoneReviewPageProps) {
  const t = useTranslations("clientSubmissions.review");
  const { data: milestone, isLoading, isError, refetch } = useClientMilestone(
    projectId,
    milestoneId,
  );
  const { data: project } = useClientProject(projectId);
  const tPageTitles = useTranslations("pageTitles");
  usePageTitle(
    project && milestone
      ? tPageTitles("milestone", { project: project.title, milestone: milestone.title })
      : undefined,
  );
  useClearUpdates(projectId, "milestones", milestoneId);
  const submissionsQuery = useClientSubmissions(projectId, milestoneId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  if (isError || !milestone) {
    return (
      <ErrorState message={t("loadFailed")} onRetry={() => refetch()} />
    );
  }

  // Only the latest submission, while it's still awaiting review (no
  // reviewFeedback recorded yet), is actionable.
  const latest = milestone.latestSubmission;
  const canReview =
    milestone.executionStatus === "Submitted" && latest && latest.reviewFeedback === null;
  // An accepted milestone is finished work — there's nothing left to change.
  const canRequestChange = milestone.executionStatus !== "Accepted";

  return (
    <MilestoneDetailShell
      projectId={projectId}
      milestone={milestone}
      actions={
        <div className="flex flex-wrap justify-end items-center gap-3">
          {canRequestChange && (
            <RequestMilestoneChangeButton
              projectId={projectId}
              milestoneId={milestone.milestoneId}
            />
          )}
          {canReview && (
            <AcceptDeliverableButton
              projectId={projectId}
              milestoneId={milestoneId}
              submissionId={latest.submissionId}
            />
          )}
        </div>
      }
    >
      {milestone.executionStatus === "NotStarted" && (
        <div className="bg-surface-muted p-4 border border-border rounded-2xl">
          <p className="text-text-secondary text-sm">
            {t("notStarted")}
          </p>
        </div>
      )}

      {milestone.executionStatus === "InProgress" && (
        <div className="bg-info-muted p-4 border border-info/20 rounded-2xl">
          <p className="text-info text-sm">
            {t("inProgress")}
          </p>
        </div>
      )}

      {milestone.executionStatus === "Accepted" && (
        <div className="bg-success-muted p-4 border border-success/20 rounded-2xl">
          <p className="text-success text-sm">
            {t("accepted")}
          </p>
          <Link
            href={projectHref(projectId, "payments")}
            className="inline-flex items-center gap-1.5 mt-2 font-semibold text-success text-sm underline underline-offset-2"
          >
            {t("goToPayment")}
            <ArrowRight size={14} className="rtl-flip" />
          </Link>
        </div>
      )}

      <SubmissionHistoryList
        projectId={projectId}
        submissions={submissionsQuery.data ?? []}
        isLoading={submissionsQuery.isLoading}
        isError={submissionsQuery.isError}
        onRetry={() => submissionsQuery.refetch()}
        submitterName={project?.freelancerName}
      />

      {/* Asked for after reading the submissions, so it sits below them. */}
      {canReview && (
        <div className="flex justify-end">
          <RequestRevisionModal
            projectId={projectId}
            milestoneId={milestoneId}
            submissionId={latest.submissionId}
          />
        </div>
      )}
    </MilestoneDetailShell>
  );
}
