"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveContract } from "../lib/service";
import { patchClientContractCaches } from "../lib/cache";
import type { ClientApprovalRequest } from "../types/client-contract";

export function useApproveContract(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["approve-contract"],
    mutationFn: (data: ClientApprovalRequest) => approveContract(projectId, data),
    onSuccess: (response) => {
      if (response.data) {
        patchClientContractCaches(queryClient, projectId, response.data);
      }
    },
  });
}
