"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateContract } from "../lib/service";
import { patchContractCaches } from "../lib/cache";
import type { UpdateContractRequest } from "../types/contract";

export function useUpdateContract(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-contract"],
    mutationFn: (data: UpdateContractRequest) => updateContract(projectId, data),
    onSuccess: (response) => {
      if (response.data) patchContractCaches(queryClient, projectId, response.data);
    },
  });
}
