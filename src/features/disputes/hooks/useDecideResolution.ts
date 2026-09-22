"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decideResolution } from "../lib/service";
import { invalidateDisputeCaches } from "../lib/cache";
import type { DecideResolutionPayload } from "../types/dispute";

export function useDecideResolution(projectId: string, milestoneId: string, disputeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["decide-dispute-resolution"],
    mutationFn: (payload: DecideResolutionPayload) =>
      decideResolution(projectId, milestoneId, disputeId, payload),
    onSuccess: () => {
      invalidateDisputeCaches(queryClient, projectId, milestoneId, disputeId);
    },
  });
}
