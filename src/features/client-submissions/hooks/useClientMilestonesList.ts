"use client";

import { useQueries } from "@tanstack/react-query";
import { useClientContract } from "@/src/features/client-contracts/hooks/useClientContract";
import { getClientMilestone } from "../lib/service";
import type { MilestoneExecutionDetail } from "@/src/features/milestones/types/milestone";

// Client-side mirror of useFreelancerMilestonesList — same composition
// (Contract.milestones[] for briefs + a per-id execution-detail fetch), but
// against the client-mirrored endpoints, with query keys ("client-milestone")
// distinct from the freelancer's so cached data never crosses roles.
export function useClientMilestonesList(projectId: string) {
  const contractQuery = useClientContract(projectId);
  const briefs = contractQuery.data?.milestones ?? [];

  const detailQueries = useQueries({
    queries: briefs.map((brief) => ({
      queryKey: ["client-milestone", projectId, String(brief.id)],
      queryFn: async () => {
        const response = await getClientMilestone(projectId, String(brief.id));
        return response.data;
      },
      enabled: Boolean(contractQuery.data),
      retry: 1,
    })),
  });

  const milestones = detailQueries
    .map((query) => query.data)
    .filter((milestone): milestone is MilestoneExecutionDetail => Boolean(milestone))
    .sort((a, b) => a.order - b.order);

  return {
    data: milestones,
    isLoading: contractQuery.isLoading || (briefs.length > 0 && detailQueries.some((q) => q.isLoading)),
    isError: contractQuery.isError || detailQueries.some((q) => q.isError),
    refetch: () => {
      contractQuery.refetch();
      detailQueries.forEach((query) => query.refetch());
    },
  };
}
