"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContract } from "../lib/service";
import { patchContractCaches } from "../lib/cache";

export function useDeleteContract(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-contract"],
    mutationFn: () => deleteContract(projectId),
    onSuccess: () => {
      patchContractCaches(queryClient, projectId, null);
    },
  });
}
