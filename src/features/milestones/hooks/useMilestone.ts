"use client";

import { useQuery } from "@tanstack/react-query";
import { getMilestone } from "../lib/service";

export function useMilestone(projectId: string, milestoneId: string) {
  return useQuery({
    queryKey: ["milestone", projectId, milestoneId],
    queryFn: async () => {
      const response = await getMilestone(projectId, milestoneId);
      return response.data;
    },
    retry: 1,
  });
}
