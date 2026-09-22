"use client";

import { useQuery } from "@tanstack/react-query";
import { getDispute } from "../lib/service";

export function useDispute(
  projectId: string,
  milestoneId: string,
  disputeId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["dispute", projectId, milestoneId, disputeId],
    queryFn: async () => {
      const response = await getDispute(projectId, milestoneId, disputeId);
      return response.data;
    },
    enabled: enabled && Boolean(disputeId),
    retry: 1,
  });
}
