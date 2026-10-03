"use client";

import { useQueries } from "@tanstack/react-query";
import { getMilestone } from "@/src/features/milestones/lib/service";
import { getClientMilestone } from "@/src/features/client-submissions/lib/service";
import type { ChangeRequestMilestoneDelta } from "../types/change-request";

export type ChangeRequestViewer = "client" | "freelancer";

// The backend refuses to approve a change request while any milestone it
// amends has a delivery awaiting review ("Cannot approve change request:
// milestone '…' is currently submitted for review."). Looks those milestones
// up so the approve action can explain the block up front. Shares query keys
// with useMilestone / useClientMilestone so a review elsewhere refreshes it.
export function useMilestonesUnderReview(
  projectId: string,
  deltas: ChangeRequestMilestoneDelta[],
  viewer: ChangeRequestViewer,
  enabled: boolean,
) {
  const results = useQueries({
    queries: deltas.map((delta) => {
      const milestoneId = String(delta.milestoneId);
      return {
        queryKey:
          viewer === "client"
            ? ["client-milestone", projectId, milestoneId]
            : ["milestone", projectId, milestoneId],
        queryFn: async () => {
          const response =
            viewer === "client"
              ? await getClientMilestone(projectId, milestoneId)
              : await getMilestone(projectId, milestoneId);
          return response.data;
        },
        enabled,
        retry: 1,
      };
    }),
  });

  const underReview = results
    .map((result) => result.data)
    .filter((milestone) => milestone?.executionStatus === "Submitted")
    .map((milestone) => milestone!.title);

  return { underReview, isLoading: results.some((result) => result.isLoading) };
}
