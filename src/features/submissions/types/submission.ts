export interface SubmissionEvidenceFile {
  fileId: number;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  // Raw backend-relative path — never trusted directly. Every consumer must
  // build its own BFF-proxied URL (/api/projects/{id}/files/submissions/{submissionId}/evidence/{fileId})
  // from the ids instead, since this route requires the caller's own bearer
  // token and a plain download link would bypass auth.
  downloadUrl: string;
  uploadedAt: string;
}

export interface SubmissionEvidenceLink {
  linkId: number;
  url: string;
  title: string | null;
  addedAt: string;
}

export interface ReviewFeedbackAttachment {
  fileId: number;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  // Same caveat as SubmissionEvidenceFile.downloadUrl — build the BFF URL
  // from (projectId, feedbackId, fileId) instead of using this directly.
  downloadUrl: string;
  uploadedAt: string;
}

export type ClientDecision = "Accepted" | "RevisionRequested";

// Mirrors MilestoneReviewFeedbackDto. Both Accept and Request Revision
// decisions live here, on the submission version they apply to — "only the
// latest submission awaiting review can be actioned" is then just
// `reviewFeedback === null` on the latest version.
export interface MilestoneReviewFeedback {
  feedbackId: number;
  submissionId: number;
  decision: ClientDecision;
  reason: string | null;
  requiredChanges: string | null;
  acceptanceNote: string | null;
  reviewedByClientId: number;
  reviewedByClientName: string | null;
  reviewedAt: string;
  attachments: ReviewFeedbackAttachment[];
}

// Mirrors MilestoneSubmissionDto exactly. Note there is no submittedByName
// field on the backend DTO (only submittedByUserId) — since a project has
// exactly one freelancer, callers display the submitter using the project's
// own freelancerName rather than expecting it here.
export interface WorkSubmission {
  submissionId: number;
  milestoneId: number;
  versionNumber: number;
  submissionNotes: string;
  submittedByUserId: string;
  submittedAt: string;
  reviewDeadline: string;
  timeRemainingSeconds: number;
  isOverdue: boolean;
  // Raw backend string (e.g. "AwaitingReview" / "Accepted" / "RevisionRequested" /
  // "Overdue") — not strictly typed since swagger doesn't enumerate it;
  // prefer deriving UI state from reviewFeedback/isOverdue where possible.
  reviewStatus: string;
  evidenceFiles: SubmissionEvidenceFile[];
  evidenceLinks: SubmissionEvidenceLink[];
  reviewFeedback: MilestoneReviewFeedback | null;
}

export interface WorkSubmissionResponse {
  success: boolean;
  message: string;
  data: WorkSubmission | null;
  errors: string[] | null;
}

// Flat list — MilestoneSubmissionDtoIReadOnlyListApiResponse, not paginated.
export interface WorkSubmissionListResponse {
  success: boolean;
  message: string;
  data: WorkSubmission[] | null;
  errors: string[] | null;
}

export interface AcceptDeliverableRequest {
  submissionId: number;
  acceptanceNote?: string;
}
