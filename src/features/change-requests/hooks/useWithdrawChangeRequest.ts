"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { withdrawChangeRequest } from "../lib/service";
import { patchChangeRequestCaches } from "../lib/cache";

export function useWithdrawChangeRequest(projectId: string, changeRequestId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["withdraw-change-request"],
    mutationFn: () => withdrawChangeRequest(projectId, changeRequestId),
    onSuccess: (response) => {
      patchChangeRequestCaches(queryClient, projectId, response.data);
    },
  });
}
