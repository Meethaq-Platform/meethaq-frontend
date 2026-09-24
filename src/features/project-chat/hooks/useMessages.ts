"use client";

import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../lib/service";

// Polled — no websocket library in this codebase. 10s keeps chat feeling
// reasonably live without adding a new dependency.
export function useMessages(projectId: string) {
  return useQuery({
    queryKey: ["messages", projectId],
    queryFn: async () => {
      const response = await getMessages(projectId);
      return response.data?.items ?? [];
    },
    refetchInterval: 10_000,
    retry: 1,
  });
}
