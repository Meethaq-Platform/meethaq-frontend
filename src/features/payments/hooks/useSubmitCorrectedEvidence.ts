"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitCorrectedEvidence } from "../lib/service";
import { patchPaymentCaches } from "../lib/cache";
import type { CorrectedEvidencePayload } from "../types/payment";

export function useSubmitCorrectedEvidence(projectId: string, milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["submit-corrected-evidence"],
    mutationFn: (payload: CorrectedEvidencePayload) =>
      submitCorrectedEvidence(projectId, milestoneId, payload),
    onSuccess: (response) => {
      patchPaymentCaches(queryClient, projectId, milestoneId, response.data);
    },
  });
}
