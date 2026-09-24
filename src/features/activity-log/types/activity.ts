// Best-guess casing — swagger types eventType as a plain string.
export type ActivityEventType =
  | "ContractApproved"
  | "MilestoneStarted"
  | "DeliverableSubmitted"
  | "RevisionRequested"
  | "DeliverableResubmitted"
  | "DeliverableAccepted"
  | "ReviewDeadlineExceeded";

// Mirrors ProjectActivityEventDto. No performedByRole or linkUrl field on
// the backend DTO — consumers compute a link client-side from milestoneId
// when present (there's no dedicated deep link to a specific submission
// version, only submissionVersion as a number).
export interface ActivityLogEntry {
  activityId: number;
  projectId: number;
  milestoneId: number | null;
  submissionVersion: number | null;
  eventType: string;
  description: string;
  performedByUserId: string;
  performedByName: string;
  fromStatus: string | null;
  toStatus: string | null;
  createdAt: string;
}

// Cursor-paginated — ProjectActivityEventDtoCursorPaginatedResponse.
export interface ActivityLogListData {
  items: ActivityLogEntry[];
  nextCursor: string | null;
  hasMore: boolean;
  pageSize: number;
}

export interface ActivityLogListResponse {
  success: boolean;
  message: string;
  data: ActivityLogListData | null;
  errors: string[] | null;
}
