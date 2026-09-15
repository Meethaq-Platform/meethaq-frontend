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

export interface ProjectSummary {
  id: number;
  title: string;
  status: ProjectStatus;
  clientId: number | null;
  clientName: string | null;
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
}

export interface UpdateProjectRequest {
  title: string;
  description: string;
  totalValue?: number | null;
}

export interface LinkClientRequest {
  relationshipId: number;
}
