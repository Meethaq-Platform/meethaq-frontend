"use client";

import { useQuery } from "@tanstack/react-query";
import { getPaymentsSummary } from "../lib/service";

export function usePaymentsSummary(projectId: string) {
  return useQuery({
    queryKey: ["payments-summary", projectId],
    queryFn: async () => {
      const response = await getPaymentsSummary(projectId);
      return response.data;
    },
    retry: 1,
  });
}
