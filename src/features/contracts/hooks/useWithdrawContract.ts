"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { withdrawContract } from "../lib/service";
import { patchContractCaches } from "../lib/cache";

export function useWithdrawContract(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["withdraw-contract"],
    mutationFn: () => withdrawContract(projectId),
    onSuccess: (response) => {
      if (response.data) patchContractCaches(queryClient, projectId, response.data);
    },
  });
}
