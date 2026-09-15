"use client";

import { useQuery } from "@tanstack/react-query";
import { getClientContract } from "../lib/service";

export function useClientContract(projectId: string, enabled = true) {
  return useQuery({
    queryKey: ["client-contract", projectId],
    queryFn: async () => {
      const response = await getClientContract(projectId);
      return response.data;
    },
    enabled,
    retry: 1,
  });
}
