"use client";

import { useQuery } from "@tanstack/react-query";
import { getClientSubmissions } from "../lib/service";

export function useClientSubmissions(projectId: string, milestoneId: string) {
  return useQuery({
    queryKey: ["client-submissions", projectId, milestoneId],
    queryFn: async () => {
      const response = await getClientSubmissions(projectId, milestoneId);
      return response.data ?? [];
    },
    retry: 1,
  });
}
