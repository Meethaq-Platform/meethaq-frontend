"use client";

import { useQuery } from "@tanstack/react-query";
import { getActivity } from "../lib/service";

export function useActivity(projectId: string) {
  return useQuery({
    queryKey: ["activity", projectId],
    queryFn: async () => {
      const response = await getActivity(projectId);
      return response.data?.items ?? [];
    },
    retry: 1,
  });
}
