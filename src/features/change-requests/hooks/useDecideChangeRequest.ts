"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decideChangeRequest } from "../lib/service";
import { invalidateAfterApproval } from "../lib/cache";
import type { DecideChangeRequestPayload } from "../types/change-request";

export function useDecideChangeRequest(projectId: string, changeRequestId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["decide-change-request"],
    mutationFn: (payload: DecideChangeRequestPayload) =>
      decideChangeRequest(projectId, changeRequestId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["change-requests", projectId] });
      queryClient.invalidateQueries({
        queryKey: ["change-request", projectId, changeRequestId],
      });
      if (response.data?.contractAmendment) {
        invalidateAfterApproval(queryClient, projectId);
      }
    },
  });
}
