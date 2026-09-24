"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addEvidence } from "../lib/service";
import type { AddEvidencePayload } from "../types/dispute";

export function useAddEvidence(projectId: string, milestoneId: string, disputeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-dispute-evidence"],
    mutationFn: (payload: AddEvidencePayload) =>
      addEvidence(projectId, milestoneId, disputeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dispute", projectId, milestoneId, disputeId],
      });
    },
  });
}
