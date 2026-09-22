import type {
  ClientDashboardResponse,
  DashboardRole,
  FinancialTrendResponse,
  FreelancerDashboardResponse,
  PaymentFollowUpResponse,
  TrendPeriod,
} from "../types/dashboard";

export interface GetDashboardParams {
  currency?: string;
  timezone?: string;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const search = query.toString();
  return search ? `?${search}` : "";
}

export async function getFreelancerDashboard(
  params: GetDashboardParams,
): Promise<FreelancerDashboardResponse> {
  const response = await fetch(
    `/api/freelancer/dashboard${buildQuery({
      currency: params.currency,
      timezone: params.timezone,
    })}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load your dashboard.");
  }

  return data;
}

export async function getClientDashboard(
  params: GetDashboardParams,
): Promise<ClientDashboardResponse> {
  const response = await fetch(
    `/api/client/dashboard${buildQuery({
      currency: params.currency,
      timezone: params.timezone,
    })}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load your dashboard.");
  }

  return data;
}

export async function getFinancialTrend(
  role: DashboardRole,
  months: TrendPeriod,
  currency?: string,
): Promise<FinancialTrendResponse> {
  const response = await fetch(
    `/api/${role}/dashboard/financial-trend${buildQuery({ months, currency })}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load the income trend.");
  }

  return data;
}

export async function getPaymentFollowUp(
  role: DashboardRole,
  currency?: string,
): Promise<PaymentFollowUpResponse> {
  const response = await fetch(
    `/api/${role}/dashboard/payment-follow-up${buildQuery({ currency })}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load payment follow-up.");
  }

  return data;
}
