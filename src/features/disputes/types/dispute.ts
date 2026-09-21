// Mirrors DisputeStatus. Swagger lists this as an unnamed integer enum
// (0-3) — the sprint doc only names 3 statuses (Open, Resolution Proposed,
// Resolved); Withdrawn is inferred from the existence of the withdraw
// endpoint and placed last (same convention as ChangeRequestStatus's
// Withdrawn). Display-only — verify against live data and fix here if wrong.
export type DisputeStatus = 0 | 1 | 2 | 3;

export const DISPUTE_STATUS_LABEL: Record<DisputeStatus, string> = {
  0: "Open",
  1: "Resolution Proposed",
  2: "Resolved",
  3: "Withdrawn",
};

// Mirrors DisputeCategory (0-5). Order matches the sprint doc's own listed
// order exactly. This IS submitted by the user (Open Dispute form) — a wrong
// guess mislabels which category ordinal a user's selection sends, same
// correctness risk class as PaymentMethod.
export type DisputeCategory = 0 | 1 | 2 | 3 | 4 | 5;

export const DISPUTE_CATEGORY_OPTIONS: { value: DisputeCategory; label: string }[] = [
  { value: 0, label: "Deliverable Quality" },
  { value: 1, label: "Scope Disagreement" },
  { value: 2, label: "Missed Deadline" },
  { value: 3, label: "Acceptance Disagreement" },
  { value: 4, label: "Payment Issue" },
  { value: 5, label: "Other" },
];

export const DISPUTE_CATEGORY_LABEL: Record<DisputeCategory, string> = Object.fromEntries(
  DISPUTE_CATEGORY_OPTIONS.map((o) => [o.value, o.label]),
) as Record<DisputeCategory, string>;

// Mirrors DisputeProposalStatus (0-2) — no textual anchor in the doc at all,
// ordered by the obvious lifecycle (submitted -> accepted/rejected).
export type DisputeProposalStatus = 0 | 1 | 2;

export const DISPUTE_PROPOSAL_STATUS_LABEL: Record<DisputeProposalStatus, string> = {
  0: "Pending",
  1: "Accepted",
  2: "Rejected",
};

// Mirrors DisputeEvidenceSourceType (0-7) — the shakiest guess in this
// sprint: the doc describes the evidence *package* (contract, amendments,
// milestone terms, submissions, feedback, messages, payments, activity,
// user-added evidence) but never enumerates this specific backend enum.
// Display-only; the UI renders a generic "Evidence" label for any
// unmapped/unexpected value rather than breaking.
export type DisputeEvidenceSourceType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const DISPUTE_EVIDENCE_SOURCE_LABEL: Record<DisputeEvidenceSourceType, string> = {
  0: "Contract",
  1: "Amendment",
  2: "Milestone Terms",
  3: "Submission",
  4: "Client Feedback",
  5: "Message",
  6: "Payment Record",
  7: "User Upload",
};

// Mirrors DisputeSummaryDto (list item).
export interface DisputeSummary {
  id: number;
  milestoneId: number;
  milestoneTitle: string;
  category: DisputeCategory;
  status: DisputeStatus;
  openedByUserId: string;
  openedAt: string;
}

export interface DisputeListData {
  items: DisputeSummary[];
  nextCursor: string | null;
  hasMore: boolean;
  pageSize: number;
}

export interface DisputeListResponse {
  success: boolean;
  message: string;
  data: DisputeListData | null;
  errors: string[] | null;
}

export interface DisputeEvidenceItem {
  id: number;
  sourceType: DisputeEvidenceSourceType;
  isOpeningSnapshot: boolean;
  description: string | null;
  fileName: string | null;
  fileSizeBytes: number | null;
  uploadedByUserId: string | null;
  externalUrl: string | null;
  addedAt: string;
  downloadUrl: string | null;
}

export interface DisputeContractTermsSummary {
  contractId: number;
  title: string;
  approvedAt: string | null;
  amendmentsCount: number;
}

export interface DisputeEvidencePackageOverview {
  contractTerms: DisputeContractTermsSummary | null;
  submissionsCount: number;
  feedbackReviewsCount: number;
  chatMessagesCount: number;
  paymentRecordsCount: number;
  userEvidenceItems: DisputeEvidenceItem[];
}

export interface DisputeResolutionProposal {
  proposalId: number;
  disputeId: number;
  status: DisputeProposalStatus;
  proposedResolution: string;
  proposedByUserId: string;
  proposedAt: string;
  decidedAt: string | null;
  decidedByUserId: string | null;
  rejectionReason: string | null;
}

// Mirrors DisputeDetailDto.
export interface DisputeDetail {
  id: number;
  projectId: number;
  milestoneId: number;
  milestoneTitle: string;
  category: DisputeCategory;
  description: string;
  requestedResolution: string;
  status: DisputeStatus;
  openedByUserId: string;
  openedAt: string;
  resolvedAt: string | null;
  resolvedByUserId: string | null;
  evidencePackage: DisputeEvidencePackageOverview;
  resolutionProposals: DisputeResolutionProposal[];
}

export interface DisputeDetailResponse {
  success: boolean;
  message: string;
  data: DisputeDetail | null;
  errors: string[] | null;
}

export interface OpenDisputePayload {
  category: DisputeCategory;
  description: string;
  requestedResolution: string;
  evidenceFiles: File[];
}

export interface AddEvidencePayload {
  description?: string;
  externalUrl?: string;
  evidenceFile?: File;
}

export interface ProposeResolutionPayload {
  proposedResolution: string;
}

export interface DecideResolutionPayload {
  proposalId: number;
  accept: boolean;
  rejectionReason?: string;
}

export interface DisputeResolutionDecisionResult {
  disputeId: number;
  status: DisputeStatus;
  resolvedByUserId: string | null;
  resolvedAt: string | null;
  rejectionReason: string | null;
  isOperationalHoldActive: boolean;
}

export interface DisputeResolutionDecisionResponse {
  success: boolean;
  message: string;
  data: DisputeResolutionDecisionResult | null;
  errors: string[] | null;
}

export interface DisputeResolutionProposalResponse {
  success: boolean;
  message: string;
  data: DisputeResolutionProposal | null;
  errors: string[] | null;
}

export interface DisputeEvidenceItemResponse {
  success: boolean;
  message: string;
  data: DisputeEvidenceItem | null;
  errors: string[] | null;
}
