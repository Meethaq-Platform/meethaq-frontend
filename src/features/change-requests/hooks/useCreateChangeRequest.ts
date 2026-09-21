"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChangeRequest } from "../lib/service";
import type { CreateChangeRequestPayload } from "../types/change-request";

export function useCreateChangeRequest(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-change-request"],
    mutationFn: (payload: CreateChangeRequestPayload) =>
      createChangeRequest(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["change-requests", projectId] });
    },
  });
}
