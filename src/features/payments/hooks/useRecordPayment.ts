"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recordPayment } from "../lib/service";
import { patchPaymentCaches } from "../lib/cache";
import type { RecordPaymentPayload } from "../types/payment";

export function useRecordPayment(projectId: string, milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["record-payment"],
    mutationFn: (payload: RecordPaymentPayload) =>
      recordPayment(projectId, milestoneId, payload),
    onSuccess: (response) => {
      patchPaymentCaches(queryClient, projectId, milestoneId, response.data);
    },
  });
}
