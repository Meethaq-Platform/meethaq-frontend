"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../lib/service";
import type { GetProjectsParams } from "../types/project";

// List rows are ProjectSummary, not the full Project the detail query needs,
// so unlike useClients this doesn't seed the ["project", id] cache.
export function useProjects(params: GetProjectsParams) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: async () => {
      const response = await getProjects(params);
      return response.data;
    },
    retry: 1,
  });
}
