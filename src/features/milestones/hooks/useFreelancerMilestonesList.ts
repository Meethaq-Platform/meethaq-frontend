"use client";

import { useQueries } from "@tanstack/react-query";
import { useContract } from "@/src/features/contracts/hooks/useContract";
import { getMilestone } from "../lib/service";
import type { MilestoneExecutionDetail } from "../types/milestone";

// There is no "list milestones with execution status" endpoint on the
// backend, so this composes one: the Contract's own milestones[] gives the
// drafting-time briefs (title/dueDate/value/order), and each row's execution
// status/latestSubmission comes from a parallel per-id fetch of the same
// endpoint MilestoneDetailShell uses — so navigating from this list into a
// milestone's detail page is an instant cache hit, not a second fetch.
export function useFreelancerMilestonesList(projectId: string) {
  const contractQuery = useContract(projectId);
  const briefs = contractQuery.data?.milestones ?? [];

  const detailQueries = useQueries({
    queries: briefs.map((brief) => ({
      queryKey: ["milestone", projectId, String(brief.id)],
      queryFn: async () => {
        const response = await getMilestone(projectId, String(brief.id));
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
