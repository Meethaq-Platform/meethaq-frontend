"use client";

import { useQuery } from "@tanstack/react-query";
import { getClientProjects } from "../lib/service";
import type { GetClientProjectsParams } from "../types/client-project";

export function useClientProjects(params: GetClientProjectsParams) {
  return useQuery({
    queryKey: ["client-projects", params],
    queryFn: async () => {
      const response = await getClientProjects(params);
      return response.data;
    },
    retry: 1,
  });
}
