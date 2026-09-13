"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestContractChanges } from "../lib/service";
import { patchClientContractCaches } from "../lib/cache";
import type { ContractChangeRequest } from "../types/client-contract";

export function useRequestContractChanges(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["request-contract-changes"],
    mutationFn: (data: ContractChangeRequest) =>
      requestContractChanges(projectId, data),
    onSuccess: (response) => {
      if (response.data) {
        patchClientContractCaches(queryClient, projectId, response.data);
      }
    },
  });
}
