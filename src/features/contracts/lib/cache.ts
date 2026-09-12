import type { QueryClient } from "@tanstack/react-query";
import type { Contract } from "../types/contract";

// Contract mutations change Project.contractStatus/contractAction too, but
// none of these endpoints return the updated project — refetch it instead of
// trying to derive its string status from the contract's numeric one.
export function patchContractCaches(
  queryClient: QueryClient,
  projectId: string,
  contract: Contract | null,
) {
  queryClient.setQueryData(["contract", projectId], contract);
  queryClient.invalidateQueries({ queryKey: ["project", projectId] });
}
