"use client";

import { useQuery } from "@tanstack/react-query";
import { getChangeRequest } from "../lib/service";

export function useChangeRequest(projectId: string, changeRequestId: string, enabled = true) {
  return useQuery({
    queryKey: ["change-request", projectId, changeRequestId],
    queryFn: async () => {
      const response = await getChangeRequest(projectId, changeRequestId);
      return response.data;
    },
    enabled: enabled && Boolean(changeRequestId),
    retry: 1,
  });
}
