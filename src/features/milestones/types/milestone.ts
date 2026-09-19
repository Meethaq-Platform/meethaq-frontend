import type { WorkSubmission } from "@/src/features/submissions/types/submission";

// Mirrors the live backend's MilestoneExecutionDetailDto. executionStatus is
// typed as a plain string by swagger (no enum values listed) — this union is
// our best-guess PascalCase casing, matching every other string-enum already
// live on this backend (Project.status, ProjectContractStatus). Verify
// against a real response once live data exists; widen to `string` with a
// fallback in the label map if the casing turns out different.
export type MilestoneExecutionStatus =
  | "NotStarted"
  | "InProgress"
  | "Submitted"
  | "RevisionRequested"
  | "Accepted";

export const MILESTONE_EXECUTION_STATUS_LABEL: Record<
  MilestoneExecutionStatus,
  string
> = {
  NotStarted: "Not Started",
  InProgress: "In Progress",
  Submitted: "Submitted",
  RevisionRequested: "Revision Requested",
  Accepted: "Accepted",
};

// Mirrors MilestoneExecutionDetailDto exactly (field names included) — this
// is a distinct shape from contracts/types/contract.ts's Milestone (the
// drafting-time DTO, no execution fields), matching how the backend itself
// models them as two separate DTOs.
export interface MilestoneExecutionDetail {
  milestoneId: number;
  projectId: number;
  title: string;
  description: string | null;
  deliverable: string;
  acceptanceCriteria: string;
  dueDate: string;
  allocatedValue: number;
  calculatedAmount: number;
  order: number;
  executionStatus: MilestoneExecutionStatus;
  startedAt: string | null;
  acceptedAt: string | null;
  acceptedByClientId: number | null;
  acceptanceNote: string | null;
  latestSubmission: WorkSubmission | null;
}

export interface MilestoneExecutionResponse {
  success: boolean;
  message: string;
  data: MilestoneExecutionDetail | null;
  errors: string[] | null;
}

// Mirrors ProjectExecutionOverviewDto — Module 7's summary, served directly
// by GET /projects/{id}/overview (one shared endpoint, not role-mirrored).
export interface ProjectExecutionOverview {
  projectId: number;
  totalMilestones: number;
  acceptedMilestones: number;
  awaitingReviewMilestones: number;
  revisionRequestedMilestones: number;
  overdueMilestones: number;
  allDeliverablesAccepted: boolean;
}

export interface ProjectExecutionOverviewResponse {
  success: boolean;
  message: string;
  data: ProjectExecutionOverview | null;
  errors: string[] | null;
}
