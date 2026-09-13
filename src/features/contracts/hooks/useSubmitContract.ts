"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitContract } from "../lib/service";
import { patchContractCaches } from "../lib/cache";

export function useSubmitContract(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["submit-contract"],
    mutationFn: () => submitContract(projectId),
    onSuccess: (response) => {
      if (response.data) patchContractCaches(queryClient, projectId, response.data);
    },
  });
}
