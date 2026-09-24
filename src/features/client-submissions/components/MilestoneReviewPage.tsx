"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useClientMilestone } from "../hooks/useClientMilestone";
import { useClientSubmissions } from "../hooks/useClientSubmissions";
import { MilestoneDetailShell } from "@/src/features/milestones/components/MilestoneDetailShell";
import { SubmissionHistoryList } from "@/src/features/submissions/components/SubmissionHistoryList";
import { useClientProject } from "@/src/features/client-projects/hooks/useClientProject";
import { usePageTitle } from "@/src/shared/hooks/usePageTitle";
import { AcceptDeliverableButton } from "./AcceptDeliverableButton";
import { RequestRevisionModal } from "./RequestRevisionModal";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";

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
  const { data: milestone, isLoading, isError, refetch } = useClientMilestone(
    projectId,
    milestoneId,
  );
  const { data: project } = useClientProject(projectId);
  usePageTitle(
    project && milestone ? `Projects/${project.title}/${milestone.title}` : undefined,
  );
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
      <ErrorState message="Failed to load this milestone." onRetry={() => refetch()} />
    );
  }

  // Only the latest submission, while it's still awaiting review (no
  // reviewFeedback recorded yet), is actionable.
  const latest = milestone.latestSubmission;
  const canReview =
    milestone.executionStatus === "Submitted" && latest && latest.reviewFeedback === null;

  return (
    <MilestoneDetailShell
      projectId={projectId}
      milestone={milestone}
      actions={
        canReview && (
          <div className="flex items-center gap-3">
            <RequestRevisionModal
              projectId={projectId}
              milestoneId={milestoneId}
              submissionId={latest.submissionId}
            />
            <AcceptDeliverableButton
              projectId={projectId}
              milestoneId={milestoneId}
              submissionId={latest.submissionId}
            />
          </div>
        )
      }
    >
      {milestone.executionStatus === "NotStarted" && (
        <div className="bg-surface-muted p-4 border border-border rounded-2xl">
          <p className="text-text-secondary text-sm">
            The freelancer hasn&apos;t started this milestone yet.
          </p>
        </div>
      )}

      {milestone.executionStatus === "InProgress" && (
        <div className="bg-info-muted p-4 border border-info/20 rounded-2xl">
          <p className="text-info text-sm">
            The freelancer is working on this milestone. You&apos;ll be notified once
            they submit a deliverable for review.
          </p>
        </div>
      )}

      {milestone.executionStatus === "Accepted" && (
        <div className="bg-success-muted p-4 border border-success/20 rounded-2xl">
          <p className="text-success text-sm">
            You&apos;ve accepted this milestone&apos;s deliverable. It&apos;s now
            eligible for payment processing.
          </p>
          <Link
            href={`/projects/${projectId}?tab=payments`}
            className="inline-flex items-center gap-1.5 mt-2 font-semibold text-success text-sm underline underline-offset-2"
          >
            Go to Payment
            <ArrowRight size={14} />
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
    </MilestoneDetailShell>
  );
}
