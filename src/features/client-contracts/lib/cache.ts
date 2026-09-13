import type { QueryClient } from "@tanstack/react-query";
import type { Contract } from "@/src/features/contracts/types/contract";

// Approve/request-changes change Project.contractStatus/contractAction too,
// but neither endpoint returns the updated project — refetch it instead of
// trying to derive its string status from the contract's numeric one.
export function patchClientContractCaches(
  queryClient: QueryClient,
  projectId: string,
  contract: Contract | null,
) {
  queryClient.setQueryData(["client-contract", projectId], contract);
  queryClient.invalidateQueries({ queryKey: ["client-project", projectId] });
  queryClient.invalidateQueries({ queryKey: ["contract-feedback", projectId] });
}
