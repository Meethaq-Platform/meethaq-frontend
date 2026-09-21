"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openDispute } from "../lib/service";
import type { OpenDisputePayload } from "../types/dispute";

export function useOpenDispute(projectId: string, milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["open-dispute"],
    mutationFn: (payload: OpenDisputePayload) => openDispute(projectId, milestoneId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes", projectId] });
      queryClient.invalidateQueries({ queryKey: ["payments-summary", projectId] });
    },
  });
}
