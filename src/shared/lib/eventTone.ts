export type EventTone = "primary" | "success" | "warning" | "danger" | "info";

export const eventToneClasses: Record<EventTone, string> = {
  primary: "bg-primary-muted text-primary",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  danger: "bg-danger-muted text-danger",
  info: "bg-info-muted text-info",
};

// Best-effort tone per backend eventType string (no enum values listed in
// swagger), shared between the notifications dropdown and the dashboard's
// Recent Activity feed since both surface overlapping event types.
// Unrecognized values fall back to "primary".
const eventTones: Record<string, EventTone> = {
  NewProjectMessage: "info",
  ContractSent: "info",
  ContractApproved: "success",
  MilestoneStarted: "primary",
  MilestoneSubmitted: "info",
  DeliverableSubmitted: "info",
  RevisionRequested: "warning",
  DeliverableAccepted: "success",
  MilestoneDeadlineApproaching: "warning",
  ReviewDeadlineApproaching: "warning",
  ReviewOverdue: "danger",
  PaymentEligible: "success",
  PaymentEvidenceSubmitted: "info",
  PaymentRecorded: "info",
  PaymentEvidenceUpdated: "info",
  ContractAmendmentCreated: "success",
  PaymentReceiptConfirmed: "success",
  PaymentConfirmed: "success",
  PaymentIssueReported: "danger",
  ChangeRequestSubmitted: "info",
  ChangeRequestApproved: "success",
  ChangeRequestRejected: "danger",
  ChangeRequestWithdrawn: "warning",
  ChangeRequestDecided: "info",
  DisputeOpened: "danger",
  DisputeEvidenceAdded: "danger",
  DisputeResolutionProposed: "warning",
  DisputeResolved: "success",
  ProjectCompleted: "success",
};

export function getEventTone(eventType: string | null | undefined): EventTone {
  return (eventType && eventTones[eventType]) || "primary";
}
