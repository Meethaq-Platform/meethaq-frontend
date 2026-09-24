import { CheckCircle2, MessageSquareWarning } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormat } from "@/src/shared/hooks/useFormat";

import type { WorkSubmission } from "../types/submission";
import { ReviewDeadlineBadge } from "./ReviewDeadlineBadge";
import AttachmentList, { type AttachmentListItem } from "@/src/shared/components/AttachmentList";

interface SubmissionVersionCardProps {
  projectId: string;
  submission: WorkSubmission;
  isLatestAwaitingReview: boolean;
  submitterName?: string;
}

export function SubmissionVersionCard({
  projectId,
  submission,
  isLatestAwaitingReview,
  submitterName,
}: SubmissionVersionCardProps) {
  const t = useTranslations("submissions.version");
  const format = useFormat();
  const feedback = submission.reviewFeedback;

  const evidenceAttachments: AttachmentListItem[] = submission.evidenceFiles.map((file) => ({
    id: file.fileId,
    fileName: file.fileName,
    fileUrl: `/api/projects/${projectId}/files/submissions/${submission.submissionId}/evidence/${file.fileId}`,
    fileSizeBytes: file.fileSizeBytes,
    contentType: file.contentType,
  }));

  const feedbackAttachments: AttachmentListItem[] =
    feedback?.attachments.map((file) => ({
      id: file.fileId,
      fileName: file.fileName,
      fileUrl: `/api/projects/${projectId}/files/reviews/${feedback.feedbackId}/attachments/${file.fileId}`,
      fileSizeBytes: file.fileSizeBytes,
      contentType: file.contentType,
    })) ?? [];

  return (
    <div
      className={`p-5 rounded-2xl border ${
        isLatestAwaitingReview ? "border-primary bg-primary-muted/40" : "border-border bg-surface"
      }`}
    >
      <div className="flex justify-between items-start gap-3">
        <div>
          <p className="font-semibold text-text-primary text-sm">
            {t("title", { number: submission.versionNumber })}
            {isLatestAwaitingReview && (
              <span className="ms-2 font-medium text-primary text-xs">
                {t("awaitingReview")}
              </span>
            )}
          </p>
          <p className="mt-0.5 text-text-secondary text-xs">
            {submitterName
              ? t.rich("submittedBy", {
                  name: submitterName,
                  date: format.dateTime(submission.submittedAt),
                  bdi: (chunks) => <bdi>{chunks}</bdi>,
                })
              : t("submitted", { date: format.dateTime(submission.submittedAt) })}
          </p>
        </div>

        {feedback === null ? (
          <ReviewDeadlineBadge
            reviewDeadline={submission.reviewDeadline}
            isOverdue={submission.isOverdue}
          />
        ) : feedback.decision === "Accepted" ? (
          <span className="inline-flex items-center gap-1.5 bg-success-muted px-2.5 py-1 rounded-full font-medium text-success text-xs">
            <CheckCircle2 size={12} />
            {t("accepted")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-danger-muted px-2.5 py-1 rounded-full font-medium text-danger text-xs">
            <MessageSquareWarning size={12} />
            {t("revisionRequested")}
          </span>
        )}
      </div>

      <p dir="auto" className="mt-3 text-text-primary text-sm whitespace-pre-wrap">
        {submission.submissionNotes}
      </p>

      {(evidenceAttachments.length > 0 || submission.evidenceLinks.length > 0) && (
        <div className="space-y-2 mt-3">
          <AttachmentList attachments={evidenceAttachments} />
          {submission.evidenceLinks.map((link) => (
            <a
              key={link.linkId}
              href={link.url}
              // A bare URL stays LTR; a user-given title follows its own script.
              dir={link.title ? "auto" : "ltr"}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-surface-muted hover:bg-border/40 px-3 py-2 rounded-lg font-medium text-primary text-sm truncate transition"
            >
              {link.title || link.url}
            </a>
          ))}
        </div>
      )}

      {feedback !== null && (
        <div className="mt-3 pt-3 border-border border-t">
          <p className="text-text-secondary text-xs uppercase tracking-wide">
            {feedback.decision === "Accepted" ? t("acceptanceNote") : t("revisionFeedback")}
          </p>
          {feedback.decision === "Accepted" ? (
            feedback.acceptanceNote && (
              <p dir="auto" className="mt-1 text-text-primary text-sm whitespace-pre-wrap">
                {feedback.acceptanceNote}
              </p>
            )
          ) : (
            <>
              {feedback.reason && (
                <p dir="auto" className="mt-1 text-text-primary text-sm whitespace-pre-wrap">
                  {feedback.reason}
                </p>
              )}
              {feedback.requiredChanges && (
                <div className="mt-2">
                  <p className="text-text-secondary text-xs uppercase tracking-wide">
                    {t("requiredChanges")}
                  </p>
                  <p dir="auto" className="mt-1 text-text-primary text-sm whitespace-pre-wrap">
                    {feedback.requiredChanges}
                  </p>
                </div>
              )}
              {feedbackAttachments.length > 0 && (
                <div className="mt-2">
                  <AttachmentList attachments={feedbackAttachments} />
                </div>
              )}
            </>
          )}
          <p className="mt-2 text-text-secondary text-xs">
            {(() => {
              const accepted = feedback.decision === "Accepted";
              const date = format.dateTime(feedback.reviewedAt);
              return feedback.reviewedByClientName
                ? t.rich(accepted ? "acceptedBy" : "requestedBy", {
                    name: feedback.reviewedByClientName,
                    date,
                    bdi: (chunks) => <bdi>{chunks}</bdi>,
                  })
                : t(accepted ? "acceptedByClient" : "requestedByClient", { date });
            })()}
          </p>
        </div>
      )}
    </div>
  );
}
