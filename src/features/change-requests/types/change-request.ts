// Mirrors ChangeRequestStatus. Swagger lists this as an unnamed integer enum
// (0-4) — order below matches the sprint doc's own listed order exactly
// (Draft, Pending Approval, Approved, Rejected, Withdrawn). Display-only
// (never submitted by the user), so a mismatch is a cosmetic label issue,
// not a data bug — verify against live data and fix here if wrong.
export type ChangeRequestStatus = 0 | 1 | 2 | 3 | 4;

export const CHANGE_REQUEST_STATUS_LABEL: Record<ChangeRequestStatus, string> = {
  0: "Draft",
  1: "Pending Approval",
  2: "Approved",
  3: "Rejected",
  4: "Withdrawn",
};

export interface ChangeRequestMilestoneDelta {
  id: number;
  milestoneId: number;
  title: string;
  description: string | null;
  deliverable: string;
  acceptanceCriteria: string;
  amount: number | null;
  percentage: number | null;
  dueDate: string;
}

export interface ChangeRequestAttachment {
  id: number;
  fileName: string;
  fileSizeBytes: number;
  downloadUrl: string;
}

// Mirrors ChangeRequestDto exactly.
export interface ChangeRequest {
  id: number;
  projectId: number;
  contractId: number;
  title: string;
  reason: string;
  proposedScopeChange: string | null;
  currentProjectValue: number;
  resultingProjectValue: number;
  status: ChangeRequestStatus;
  requestedByUserId: string;
  submittedAt: string;
  decidedAt: string | null;
  rejectionReason: string | null;
  milestoneDeltas: ChangeRequestMilestoneDelta[];
  attachments: ChangeRequestAttachment[];
}

// Mirrors ChangeRequestSummaryDto (list item).
export interface ChangeRequestSummary {
  id: number;
  title: string;
  status: ChangeRequestStatus;
  resultingProjectValue: number;
  requestedByUserId: string;
  submittedAt: string;
}

export interface ChangeRequestListData {
  items: ChangeRequestSummary[];
  nextCursor: string | null;
  hasMore: boolean;
  pageSize: number;
}

export interface ChangeRequestListResponse {
  success: boolean;
  message: string;
  data: ChangeRequestListData | null;
  errors: string[] | null;
}

export interface ChangeRequestResponse {
  success: boolean;
  message: string;
  data: ChangeRequest | null;
  errors: string[] | null;
}

// Mirrors ContractAmendmentDto (list item).
export interface ContractAmendment {
  id: number;
  amendmentNumber: number;
  changeRequestId: number;
  changeRequestTitle: string;
  effectiveDate: string;
  resultingProjectValue: number;
  requestedByUserId: string;
  approvedByUserId: string;
  approvedAt: string;
}

// Mirrors ContractAmendmentDetailDto — previous/new terms arrive as raw JSON
// strings from the backend (a full contract+milestones snapshot), rendered
// pretty-printed rather than modeled field-by-field.
export interface ContractAmendmentDetail {
  id: number;
  contractId: number;
  amendmentNumber: number;
  effectiveDate: string;
  previousTermsJson: string;
  approvedNewTermsJson: string;
  requestedByUserId: string;
  approvedByUserId: string;
  approvedAt: string;
}

export interface ContractAmendmentListResponse {
  success: boolean;
  message: string;
  data: ContractAmendment[] | null;
  errors: string[] | null;
}

export interface ContractAmendmentResponse {
  success: boolean;
  message: string;
  data: ContractAmendmentDetail | null;
  errors: string[] | null;
}

export interface ChangeRequestDecisionResult {
  changeRequestId: number;
  status: ChangeRequestStatus;
  decidedAt: string;
  rejectionReason: string | null;
  contractAmendment: ContractAmendment | null;
}

export interface ChangeRequestDecisionResponse {
  success: boolean;
  message: string;
  data: ChangeRequestDecisionResult | null;
  errors: string[] | null;
}

export interface MilestoneDeltaInput {
  milestoneId: number;
  title: string;
  description?: string;
  deliverable: string;
  acceptanceCriteria: string;
  amount?: number;
  percentage?: number;
  dueDate: string;
}

export interface CreateChangeRequestPayload {
  title: string;
  reason: string;
  // CONFIRMED required by the live backend (400 response: "The
  // ProposedScopeChange field is required", 10-4000 chars) — despite
  // reading as optional in the sprint doc.
  proposedScopeChange: string;
  resultingProjectValue: number;
  milestoneDeltas: MilestoneDeltaInput[];
  attachments: File[];
}

export interface DecideChangeRequestPayload {
  approved: boolean;
  rejectionReason?: string;
}
