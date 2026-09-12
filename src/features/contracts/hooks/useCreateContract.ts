"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContract } from "../lib/service";
import { patchContractCaches } from "../lib/cache";
import type { CreateContractRequest } from "../types/contract";

export function useCreateContract(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-contract"],
    mutationFn: (data: CreateContractRequest) => createContract(projectId, data),
    onSuccess: (response) => {
      if (response.data) patchContractCaches(queryClient, projectId, response.data);
    },
  });
}
