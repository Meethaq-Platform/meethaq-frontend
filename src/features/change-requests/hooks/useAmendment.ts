"use client";

import { useQuery } from "@tanstack/react-query";
import { getAmendment } from "../lib/service";

export function useAmendment(projectId: string, amendmentId: string, enabled = true) {
  return useQuery({
    queryKey: ["amendment", projectId, amendmentId],
    queryFn: async () => {
      const response = await getAmendment(projectId, amendmentId);
      return response.data;
    },
    enabled,
    retry: 1,
  });
}
