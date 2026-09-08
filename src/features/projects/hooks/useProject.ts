"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "../lib/service";

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const response = await getProjectById(id);
      return response.data;
    },
    retry: 1,
  });
}
