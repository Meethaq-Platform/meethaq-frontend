import { FileStack } from "lucide-react";
import { useTranslations } from "next-intl";

import type { WorkSubmission } from "../types/submission";
import { SubmissionVersionCard } from "./SubmissionVersionCard";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import EmptyState from "@/src/shared/components/EmptyState";

interface SubmissionHistoryListProps {
  projectId: string;
  submissions: WorkSubmission[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  submitterName?: string;
}

// Shared, role-agnostic presentation — both submissions (freelancer, via
// useSubmissions) and client-submissions (client, via useClientSubmissions)
// callers fetch through their own role-scoped endpoint and pass the result
// here, since the two hit different (mirrored) backend routes.
export function SubmissionHistoryList({
  projectId,
  submissions,
  isLoading,
  isError,
  onRetry,
  submitterName,
}: SubmissionHistoryListProps) {
  const t = useTranslations("submissions.history");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner size={24} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState message={t("loadFailed")} onRetry={onRetry} />
    );
  }

  if (submissions.length === 0) {
    return (
      <EmptyState
        icon={FileStack}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
      />
    );
  }

  const sorted = [...submissions].sort((a, b) => b.versionNumber - a.versionNumber);
  const latestVersion = sorted[0]?.versionNumber;

  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-text-primary text-base">{t("title")}</h2>
      {sorted.map((submission) => (
        <SubmissionVersionCard
          key={submission.submissionId}
          projectId={projectId}
          submission={submission}
          isLatestAwaitingReview={
            submission.versionNumber === latestVersion && submission.reviewFeedback === null
          }
          submitterName={submitterName}
        />
      ))}
    </div>
  );
}
