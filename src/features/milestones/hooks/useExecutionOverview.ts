"use client";

import { useQuery } from "@tanstack/react-query";
import { getExecutionOverview } from "../lib/service";

// GET /projects/{id}/overview is a single shared endpoint (not role-mirrored)
// — the backend determines the caller's membership itself.
export function useExecutionOverview(projectId: string) {
  return useQuery({
    queryKey: ["execution-overview", projectId],
    queryFn: async () => {
      const response = await getExecutionOverview(projectId);
      return response.data;
    },
    retry: 1,
  });
}
