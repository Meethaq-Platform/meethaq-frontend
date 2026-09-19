"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubmissions } from "../lib/service";

// Shared by both submissions (freelancer) and client-submissions (client) —
// both roles see identical version history.
export function useSubmissions(projectId: string, milestoneId: string) {
  return useQuery({
    queryKey: ["submissions", projectId, milestoneId],
    queryFn: async () => {
      const response = await getSubmissions(projectId, milestoneId);
      return response.data ?? [];
    },
    retry: 1,
  });
}
