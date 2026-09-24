// Mirrors PaymentMethod. Swagger only lists this as an unnamed integer enum
// (0-4) with zero string values anywhere in the spec, and the sprint doc
// never enumerates specific method names either — so this started as a
// placeholder guess with no textual anchor at all.
//
// FULLY VERIFIED live against MilestonePaymentDto.paymentMethod (the
// backend's own string label, echoed back after recording a payment with
// each ordinal): 0 BankTransfer, 1 WireTransfer, 2 PayPal, 3 Cash, 4 Other.
// The original guess had 1-4 wrong (guessed Cash/Check/CreditCard/Other) —
// this mapping is now the real backend enum, not a guess.
export type PaymentMethod = 0 | 1 | 2 | 3 | 4;

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 0, label: "Bank Transfer" },
  { value: 1, label: "Wire Transfer" },
  { value: 2, label: "PayPal" },
  { value: 3, label: "Cash" },
  { value: 4, label: "Other" },
];

// Mirrors MilestonePaymentDto.status — swagger types it as a plain string
// (no enum values listed), so this PascalCase union is a best-guess casing,
// same convention as MilestoneExecutionStatus in features/milestones/types.
// Order matches the sprint doc's "Payment Status" section exactly. Display
// only (never submitted), so a mismatch just shows the wrong label, not a
// data-correctness bug — UI must fall back to the raw string if unmapped.
export type MilestonePaymentStatus =
  | "NotEligible"
  | "Eligible"
  | "AwaitingConfirmation"
  | "Paid"
  | "IssueReported";

export interface PaymentEvidenceFile {
  id: number;
  fileName: string;
  fileSizeBytes: number;
  contentType: string;
  uploadedAt: string;
  downloadUrl: string;
  versionNumber: number;
  isCorrectedEvidence: boolean;
}

export interface PaymentCorrectionSubmission {
  id: number;
  submittedByClientId: string;
  submittedAt: string;
  transactionReference: string | null;
  correctionNotes: string | null;
  evidenceFiles: PaymentEvidenceFile[];
}

// Mirrors MilestonePaymentDto exactly.
export interface MilestonePayment {
  id: number;
  milestoneId: number;
  projectId: number;
  amount: number;
  currency: string;
  // Raw backend string — widened beyond MilestonePaymentStatus so an
  // unrecognized value never breaks type-checking; components must handle
  // the fallback case explicitly (see PaymentStatusBadge).
  status: string;
  paymentMethod: string;
  paymentDate: string | null;
  transactionReference: string | null;
  paymentNotes: string | null;
  recordedAt: string | null;
  confirmedAt: string | null;
  confirmedByUserId: string | null;
  evidenceFiles: PaymentEvidenceFile[];
  corrections: PaymentCorrectionSubmission[];
}

export interface MilestonePaymentResponse {
  success: boolean;
  message: string;
  data: MilestonePayment | null;
  errors: string[] | null;
}

// Mirrors MilestonePaymentSummaryItemDto.
export interface MilestonePaymentSummaryItem {
  milestoneId: number;
  milestoneTitle: string;
  order: number;
  amount: number;
  currency: string;
  executionStatus: string;
  paymentStatus: string;
  isDisputed: boolean;
  paymentDate: string | null;
}

// Mirrors ProjectPaymentSummaryDto.
export interface ProjectPaymentSummary {
  projectId: number;
  approvedProjectValue: number;
  totalPaid: number;
  totalUnpaid: number;
  amountEligible: number;
  amountAwaitingConfirmation: number;
  amountWithPaymentIssues: number;
  amountOnDisputeHold: number;
  currency: string;
  milestones: MilestonePaymentSummaryItem[];
}

export interface ProjectPaymentSummaryResponse {
  success: boolean;
  message: string;
  data: ProjectPaymentSummary | null;
  errors: string[] | null;
}

export interface RecordPaymentPayload {
  paymentMethod: PaymentMethod;
  paymentDate: string;
  amount: number;
  currency: string;
  transactionReference?: string;
  paymentNotes?: string;
  receiptFiles: File[];
}

export interface CorrectedEvidencePayload {
  updatedNotes?: string;
  updatedTransactionReference?: string;
  correctedReceiptFiles: File[];
}

export interface ReportPaymentIssuePayload {
  reason: string;
}

export interface BooleanResponse {
  success: boolean;
  message: string;
  data: boolean;
  errors: string[] | null;
}
