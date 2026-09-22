"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmReceipt } from "../lib/service";
import { patchPaymentCaches } from "../lib/cache";

export function useConfirmReceipt(projectId: string, milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["confirm-receipt"],
    mutationFn: () => confirmReceipt(projectId, milestoneId),
    onSuccess: (response) => {
      patchPaymentCaches(queryClient, projectId, milestoneId, response.data);
    },
  });
}
