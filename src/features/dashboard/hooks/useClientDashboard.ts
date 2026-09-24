"use client";

import { useQuery } from "@tanstack/react-query";
import { getClientDashboard } from "../lib/service";

export function useClientDashboard(currency?: string) {
  return useQuery({
    queryKey: ["client-dashboard", currency ?? null],
    queryFn: async () => {
      const response = await getClientDashboard({ currency });
      return response.data;
    },
    retry: 1,
  });
}
