"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { withdrawDispute } from "../lib/service";
import { invalidateDisputeCaches } from "../lib/cache";

export function useWithdrawDispute(projectId: string, milestoneId: string, disputeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["withdraw-dispute"],
    mutationFn: () => withdrawDispute(projectId, milestoneId, disputeId),
    onSuccess: () => {
      invalidateDisputeCaches(queryClient, projectId, milestoneId, disputeId);
    },
  });
}
