"use client";

import { useQuery } from "@tanstack/react-query";
import { getPaymentFollowUp } from "../lib/service";
import type { DashboardRole } from "../types/dashboard";

export function usePaymentFollowUp(role: DashboardRole, currency?: string) {
  return useQuery({
    queryKey: ["dashboard-payment-follow-up", role, currency ?? null],
    queryFn: async () => {
      const response = await getPaymentFollowUp(role, currency);
      return response.data;
    },
    retry: 1,
  });
}
