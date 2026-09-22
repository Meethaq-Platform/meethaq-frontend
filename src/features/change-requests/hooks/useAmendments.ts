"use client";

import { useQuery } from "@tanstack/react-query";
import { getAmendments } from "../lib/service";

export function useAmendments(projectId: string) {
  return useQuery({
    queryKey: ["amendments", projectId],
    queryFn: async () => {
      const response = await getAmendments(projectId);
      return response.data ?? [];
    },
    retry: 1,
  });
}
