import {
  PAYMENT_STATUS_LABEL,
  type MilestonePaymentStatus,
} from "../types/payment";

const statusStyles: Record<MilestonePaymentStatus, string> = {
  NotEligible: "bg-surface-muted text-text-secondary",
  Eligible: "bg-info-muted text-info",
  AwaitingConfirmation: "bg-warning-muted text-warning",
  Paid: "bg-success-muted text-success",
  IssueReported: "bg-danger-muted text-danger",
};

// status is a raw backend string (best-guess casing, see types/payment.ts) —
// falls back to rendering the raw value rather than breaking if it doesn't
// match one of our guessed keys.
export function PaymentStatusBadge({ status }: { status: string }) {
  const known = status as MilestonePaymentStatus;
  const style = statusStyles[known] ?? "bg-surface-muted text-text-secondary";
  const label = PAYMENT_STATUS_LABEL[known] ?? status;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}
