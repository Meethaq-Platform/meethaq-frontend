"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { proposeResolution } from "../lib/service";
import type { ProposeResolutionPayload } from "../types/dispute";

export function useProposeResolution(projectId: string, milestoneId: string, disputeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["propose-dispute-resolution"],
    mutationFn: (payload: ProposeResolutionPayload) =>
      proposeResolution(projectId, milestoneId, disputeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dispute", projectId, milestoneId, disputeId],
      });
    },
  });
}
