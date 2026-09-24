"use client";

import { useQuery } from "@tanstack/react-query";
import { getClientMilestone } from "../lib/service";

// Distinct query key from the freelancer's useMilestone (different endpoint,
// different role) even though it targets the same milestone.
export function useClientMilestone(projectId: string, milestoneId: string) {
  return useQuery({
    queryKey: ["client-milestone", projectId, milestoneId],
    queryFn: async () => {
      const response = await getClientMilestone(projectId, milestoneId);
      return response.data;
    },
    retry: 1,
  });
}
