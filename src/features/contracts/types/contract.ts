import type { ProjectContractStatus } from "@/src/features/projects/types/project";

// The Contract entity's own status/allocationMode are serialized as raw
// integers by the API (unlike Project.status, which is a string) — verified
// against the live backend rather than the swagger schema alone.
export type ContractStatus = 0 | 1 | 2 | 3;

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  0: "Draft",
  1: "Pending Approval",
  2: "Changes Requested",
  3: "Approved",
};

// Contract mutations patch the contract's own query cache immediately but
// only invalidate (not synchronously update) Project.contractStatus, so
// deriving the badge from the fresh contract avoids it briefly disagreeing
// with the rest of the page while the project query is still refetching.
export const CONTRACT_STATUS_TO_PROJECT_STATUS: Record<
  ContractStatus,
  ProjectContractStatus
> = {
  0: "Draft",
  1: "PendingApproval",
  2: "ChangesRequested",
  3: "Approved",
};

export type ContractAllocationMode = 0 | 1;

export const ALLOCATION_MODE_LABEL: Record<ContractAllocationMode, string> = {
  0: "Fixed amount",
  1: "Percentage",
};

export interface ContractSummary {
  projectValue: number;
  allocatedValue: number;
  remainingValue: number;
  totalPercentage: number;
  milestoneCount: number;
  allocationMode: ContractAllocationMode;
  isAllocationComplete: boolean;
}

export interface Milestone {
  id: number;
  contractId: number;
  title: string;
  description: string | null;
  deliverable: string;
  acceptanceCriteria: string;
  dueDate: string;
  allocationValue: number;
  calculatedAmount: number;
  order: number;
}

export interface Contract {
  id: number;
  projectId: number;
  freelancerId: number;
  clientId: number;
  title: string;
  scopeOfWork: string;
  startDate: string;
  expectedEndDate: string;
  generalTerms: string | null;
  allocationMode: ContractAllocationMode;
  status: ContractStatus;
  submittedAt: string | null;
  approvedAt: string | null;
  approvedByClientId: number | null;
  summary: ContractSummary;
  milestones: Milestone[];
  concurrencyToken: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ContractValidationErrorItem {
  code: string | null;
  field: string | null;
  milestoneId: number | null;
  message: string | null;
}

export interface ContractValidationResult {
  isValid: boolean;
  errors: ContractValidationErrorItem[];
}

export interface CreateContractRequest {
  title: string;
  scopeOfWork: string;
  startDate: string;
  expectedEndDate: string;
  generalTerms?: string;
  allocationMode: ContractAllocationMode;
}

export type UpdateContractRequest = CreateContractRequest;

export interface CreateMilestoneRequest {
  title: string;
  description?: string;
  deliverable: string;
  acceptanceCriteria: string;
  dueDate: string;
  allocationValue: number;
}

export type UpdateMilestoneRequest = CreateMilestoneRequest;

export interface ReorderMilestonesRequest {
  milestoneIds: number[];
}

export interface ContractResponse {
  success: boolean;
  message: string;
  data: Contract | null;
  errors: string[] | null;
}

export interface MilestoneResponse {
  success: boolean;
  message: string;
  data: Milestone | null;
  errors: string[] | null;
}

export interface MilestonesReorderResponse {
  success: boolean;
  message: string;
  data: Milestone[] | null;
  errors: string[] | null;
}

export interface ContractValidationResponse {
  success: boolean;
  message: string;
  data: ContractValidationResult | null;
  errors: string[] | null;
}

export interface BooleanResponse {
  success: boolean;
  message: string;
  data: boolean;
  errors: string[] | null;
}
