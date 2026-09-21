export type ProjectStatus = "Draft" | "Active" | "Cancelled" | "Completed";

// Project.contractStatus/contractAction are already string-labeled by the
// API (unlike the Contract entity's own numeric status), driving the CTA
// shown on the project's Contract section.
export type ProjectContractStatus =
  | "None"
  | "Draft"
  | "PendingApproval"
  | "ChangesRequested"
  | "Approved";

export type ProjectContractAction =
  | "EditDraft"
  | "AwaitingClientApproval"
  | "ReviewChanges"
  | "ViewContract";

export interface Project {
  id: number;
  title: string;
  description: string | null;
  status: ProjectStatus;
  freelancerId: number;
  freelancerName: string;
  clientId: number | null;
  clientName: string | null;
  acceptedAt: string | null;
  acceptedByClientId: number | null;
  acceptedByClientName: string | null;
  totalValue: number | null;
  contractStatus: ProjectContractStatus;
  contractAction: ProjectContractAction | null;
  contractFeedbackSummary: string | null;
  contractApprovedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

// The backend's ProjectSummaryDto already includes totalValue/contractStatus/
// contractAction (verified against the live swagger spec) — declared here so
// the projects table can show them instead of silently dropping the fields.
export interface ProjectSummary {
  id: number;
  title: string;
  status: ProjectStatus;
  clientId: number | null;
  clientName: string | null;
  totalValue: number | null;
  contractStatus: ProjectContractStatus;
  contractAction: ProjectContractAction | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ProjectsListData {
  items: ProjectSummary[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ProjectsListResponse {
  success: boolean;
  message: string;
  data: ProjectsListData | null;
  errors: string[] | null;
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: Project | null;
  errors: string[] | null;
}

export interface GetProjectsParams {
  pageNumber: number;
  pageSize: number;
  status?: ProjectStatus;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  relationshipId?: number;
  totalValue?: number | null;
}

export interface UpdateProjectRequest {
  title: string;
  description: string;
  totalValue?: number | null;
}

export interface LinkClientRequest {
  relationshipId: number;
}

// Mirrors ProjectReconciliationSummaryDto.
export interface ProjectReconciliationSummary {
  finalProjectValue: number;
  totalPaidAmount: number;
  currency: string;
  totalMilestones: number;
  acceptedMilestonesCount: number;
  paidMilestonesCount: number;
  unresolvedDisputesCount: number;
  pendingChangeRequestsCount: number;
}

// Mirrors ProjectCompletionResultDto. `status` is deliberately omitted here —
// swagger types it against the same ProjectStatus schema object used
// elsewhere as a raw int (e.g. Contract.status), but Project.status itself
// is confirmed to already serialize as the string ProjectStatus union above.
// Rather than guess which convention this one response follows, callers
// should invalidate/refetch the project query and read status from there.
export interface ProjectCompletionResult {
  projectId: number;
  completedAt: string;
  completedByUserId: string;
  reconciliationSummary: ProjectReconciliationSummary;
  completionNotes: string | null;
}

export interface ProjectCompletionResponse {
  success: boolean;
  message: string;
  data: ProjectCompletionResult | null;
  errors: string[] | null;
}

export interface CompleteProjectPayload {
  completionNotes?: string;
}
