import type { QueryClient } from "@tanstack/react-query";

// Every dispute mutation potentially affects: the project-wide disputes
// list, this dispute's own detail, and the payment summary's dispute-hold
// amount + per-milestone isDisputed flag (opening/resolving/withdrawing a
// dispute all change the hold state).
export function invalidateDisputeCaches(
  queryClient: QueryClient,
  projectId: string,
  milestoneId: string,
  disputeId: string,
) {
  queryClient.invalidateQueries({ queryKey: ["disputes", projectId] });
  queryClient.invalidateQueries({ queryKey: ["dispute", projectId, milestoneId, disputeId] });
  queryClient.invalidateQueries({ queryKey: ["payments-summary", projectId] });
}
