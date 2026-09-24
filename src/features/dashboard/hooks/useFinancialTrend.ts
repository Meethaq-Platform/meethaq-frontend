"use client";

import { useQuery } from "@tanstack/react-query";
import { getFinancialTrend } from "../lib/service";
import type { DashboardRole, TrendPeriod } from "../types/dashboard";

export function useFinancialTrend(
  role: DashboardRole,
  months: TrendPeriod,
  currency?: string,
) {
  return useQuery({
    queryKey: ["dashboard-financial-trend", role, months, currency ?? null],
    queryFn: async () => {
      const response = await getFinancialTrend(role, months, currency);
      return response.data;
    },
    retry: 1,
  });
}
