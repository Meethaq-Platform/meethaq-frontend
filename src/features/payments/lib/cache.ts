import type { QueryClient } from "@tanstack/react-query";
import type { MilestonePayment } from "../types/payment";

// A payment mutation always affects both this milestone's own payment record
// and the project-wide summary's totals — every mutation hook below patches
// the detail query directly (avoids a refetch round-trip) and invalidates
// the summary (its aggregation can't be derived client-side reliably).
export function patchPaymentCaches(
  queryClient: QueryClient,
  projectId: string,
  milestoneId: string,
  payment: MilestonePayment | null,
) {
  queryClient.setQueryData(["milestone-payment", projectId, milestoneId], payment);
  queryClient.invalidateQueries({ queryKey: ["payments-summary", projectId] });
}
