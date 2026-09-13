"use client";

import { useQuery } from "@tanstack/react-query";
import { getContract } from "../lib/service";

export function useContract(projectId: string) {
  return useQuery({
    queryKey: ["contract", projectId],
    queryFn: async () => {
      const response = await getContract(projectId);
      return response.data;
    },
    retry: 1,
  });
}
