import type {
  CorrectedEvidencePayload,
  MilestonePaymentResponse,
  ProjectPaymentSummaryResponse,
  RecordPaymentPayload,
  ReportPaymentIssuePayload,
} from "../types/payment";

export async function getPaymentsSummary(
  projectId: string,
): Promise<ProjectPaymentSummaryResponse> {
  const response = await fetch(`/api/projects/${projectId}/payments/summary`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load payment summary.");
  }

  return result;
}

// 404 is a normal "not yet eligible" state for a milestone that hasn't been
// accepted yet — same treatment as getClientContract's "no contract yet".
export async function getMilestonePayment(
  projectId: string,
  milestoneId: string,
): Promise<MilestonePaymentResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/milestones/${milestoneId}/payments`,
  );
  const result = await response.json();

  if (response.status === 404) return result;

  if (!response.ok) {
    throw new Error(result.message || "Failed to load payment details.");
  }

  return result;
}

// Field names match the backend's multipart binding exactly: PaymentMethod,
// PaymentDate, Amount, Currency, TransactionReference, PaymentNotes, ReceiptFiles.
export async function recordPayment(
  projectId: string,
  milestoneId: string,
  payload: RecordPaymentPayload,
): Promise<MilestonePaymentResponse> {
  const formData = new FormData();
  formData.set("PaymentMethod", String(payload.paymentMethod));
  formData.set("PaymentDate", payload.paymentDate);
  formData.set("Amount", String(payload.amount));
  formData.set("Currency", payload.currency);
  if (payload.transactionReference) {
    formData.set("TransactionReference", payload.transactionReference);
  }
  if (payload.paymentNotes) {
    formData.set("PaymentNotes", payload.paymentNotes);
  }
  for (const file of payload.receiptFiles) {
    formData.append("ReceiptFiles", file);
  }

  const response = await fetch(
    `/api/client/projects/${projectId}/milestones/${milestoneId}/payments`,
    { method: "POST", body: formData },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to record payment.");
  }

  return result;
}

export async function submitCorrectedEvidence(
  projectId: string,
  milestoneId: string,
  payload: CorrectedEvidencePayload,
): Promise<MilestonePaymentResponse> {
  const formData = new FormData();
  if (payload.updatedNotes) {
    formData.set("UpdatedNotes", payload.updatedNotes);
  }
  if (payload.updatedTransactionReference) {
    formData.set("UpdatedTransactionReference", payload.updatedTransactionReference);
  }
  for (const file of payload.correctedReceiptFiles) {
    formData.append("CorrectedReceiptFiles", file);
  }

  const response = await fetch(
    `/api/client/projects/${projectId}/milestones/${milestoneId}/payments/corrected-evidence`,
    { method: "POST", body: formData },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit corrected evidence.");
  }

  return result;
}

// Restricted server-side to the owning Freelancer.
export async function confirmReceipt(
  projectId: string,
  milestoneId: string,
): Promise<MilestonePaymentResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/milestones/${milestoneId}/payments/confirm`,
    { method: "POST" },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to confirm receipt.");
  }

  return result;
}

// Restricted server-side to the owning Freelancer.
export async function reportPaymentIssue(
  projectId: string,
  milestoneId: string,
  payload: ReportPaymentIssuePayload,
): Promise<MilestonePaymentResponse> {
  const response = await fetch(
    `/api/projects/${projectId}/milestones/${milestoneId}/payments/report-issue`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to report payment issue.");
  }

  return result;
}
