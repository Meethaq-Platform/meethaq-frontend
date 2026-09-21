"use client";

import { useQuery } from "@tanstack/react-query";
import { getMilestonePayment } from "../lib/service";

export function useMilestonePayment(projectId: string, milestoneId: string, enabled = true) {
  return useQuery({
    queryKey: ["milestone-payment", projectId, milestoneId],
    queryFn: async () => {
      const response = await getMilestonePayment(projectId, milestoneId);
      return response.data;
    },
    enabled,
    retry: 1,
  });
}
