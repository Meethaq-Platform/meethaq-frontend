import type { QueryClient } from "@tanstack/react-query";
import type { ChangeRequest } from "../types/change-request";

// A decide/withdraw mutation always affects: this change request's own
// detail query, the project's change-requests list (status changed), and —
// on approval only — the contract/milestone/payment-summary caches, since
// an approved amendment can alter milestone terms/amounts. Approval-specific
// invalidation is intentionally broad (the exact diff isn't worth computing
// client-side) rather than trying to patch milestone data in place.
export function patchChangeRequestCaches(
  queryClient: QueryClient,
  projectId: string,
  changeRequest: ChangeRequest | null,
) {
  if (changeRequest) {
    queryClient.setQueryData(
      ["change-request", projectId, String(changeRequest.id)],
      changeRequest,
    );
  }

  queryClient.invalidateQueries({ queryKey: ["change-requests", projectId] });
}

export function invalidateAfterApproval(queryClient: QueryClient, projectId: string) {
  queryClient.invalidateQueries({ queryKey: ["contract", projectId] });
  queryClient.invalidateQueries({ queryKey: ["client-contract", projectId] });
  queryClient.invalidateQueries({ queryKey: ["amendments", projectId] });
  queryClient.invalidateQueries({ queryKey: ["payments-summary", projectId] });
  queryClient.invalidateQueries({ queryKey: ["project", projectId] });
  // Prefix match — invalidates every ["milestone", projectId, milestoneId]
  // entry regardless of which milestone(s) the amendment touched.
  queryClient.invalidateQueries({ queryKey: ["milestone", projectId] });
  queryClient.invalidateQueries({ queryKey: ["client-milestone", projectId] });
}
