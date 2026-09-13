"use client";

import { useQuery } from "@tanstack/react-query";
import { getContractFeedback } from "../lib/service";

export function useContractFeedback(projectId: string, enabled = true) {
  return useQuery({
    queryKey: ["contract-feedback", projectId],
    queryFn: async () => {
      const response = await getContractFeedback(projectId);
      return response.data;
    },
    enabled,
    retry: 1,
  });
}
