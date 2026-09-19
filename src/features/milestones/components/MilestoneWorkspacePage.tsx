"use client";

import { useMilestone } from "../hooks/useMilestone";
import { MilestoneDetailShell } from "./MilestoneDetailShell";
import { StartMilestoneButton } from "./StartMilestoneButton";
import { useProject } from "@/src/features/projects/hooks/useProject";
import { useSubmissions } from "@/src/features/submissions/hooks/useSubmissions";
import { SubmitWorkForm } from "@/src/features/submissions/components/SubmitWorkForm";
import { SubmissionHistoryList } from "@/src/features/submissions/components/SubmissionHistoryList";
import { RemindClientButton } from "@/src/features/submissions/components/RemindClientButton";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";

interface MilestoneWorkspacePageProps {
  projectId: string;
  milestoneId: string;
}

// Freelancer's milestone-detail body. Server-side enforcement that only the
// project's own freelancer can start/submit is a backend responsibility
// (the BFF thin-proxies for JSON routes; the file routes are the one place
// it enforces auth itself) — this component only controls which actions are
// *shown*.
export function MilestoneWorkspacePage({
  projectId,
  milestoneId,
}: MilestoneWorkspacePageProps) {
  const { data: milestone, isLoading, isError, refetch } = useMilestone(
    projectId,
    milestoneId,
  );
  const { data: project } = useProject(projectId);
  const submissionsQuery = useSubmissions(projectId, milestoneId);

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

  const canStart = milestone.executionStatus === "NotStarted";
  const canSubmit =
    milestone.executionStatus === "InProgress" ||
    milestone.executionStatus === "RevisionRequested";
  const isAwaitingReview = milestone.executionStatus === "Submitted";
  const latest = milestone.latestSubmission;
  const isOverdue = Boolean(
    isAwaitingReview && latest && latest.reviewFeedback === null && latest.isOverdue,
  );

  return (
    <MilestoneDetailShell
      projectId={projectId}
      milestone={milestone}
      actions={
        canStart ? (
          <StartMilestoneButton projectId={projectId} milestoneId={milestone.milestoneId} />
        ) : (
          isOverdue &&
          latest && (
            <RemindClientButton
              projectId={projectId}
              milestoneId={milestoneId}
              submissionId={latest.submissionId}
            />
          )
        )
      }
    >
      {milestone.executionStatus === "RevisionRequested" && (
        <div className="bg-danger-muted p-4 border border-danger/20 rounded-2xl">
          <p className="text-danger text-sm">
            The client requested revisions to your latest submission. Review their
            feedback below and submit a new version.
          </p>
        </div>
      )}

      {canSubmit && (
        <div className="bg-surface p-6 border border-border rounded-2xl">
          <h2 className="mb-4 font-semibold text-text-primary text-base">
            Submit Deliverable
          </h2>
          <SubmitWorkForm projectId={projectId} milestoneId={milestoneId} />
        </div>
      )}

      {isAwaitingReview && (
        <div className="bg-warning-muted p-4 border border-warning/20 rounded-2xl">
          <p className="text-warning text-sm">
            Your latest submission is awaiting the client&apos;s review. You can&apos;t
            replace it while it&apos;s pending — check back after they respond.
          </p>
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
