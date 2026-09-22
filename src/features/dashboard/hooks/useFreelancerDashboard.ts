"use client";

import { useQuery } from "@tanstack/react-query";
import { getFreelancerDashboard } from "../lib/service";

export function useFreelancerDashboard(currency?: string) {
  return useQuery({
    queryKey: ["freelancer-dashboard", currency ?? null],
    queryFn: async () => {
      const response = await getFreelancerDashboard({ currency });
      return response.data;
    },
    retry: 1,
  });
}
