"use client";

import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import { DashboardSkeleton } from "./DashboardSkeleton";
import FreelancerDashboard from "./FreelancerDashboard";
import ClientDashboard from "./ClientDashboard";

// Feature 1: Login → Detect Role → Open Role-Based Home.
export default function DashboardHome() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const isFreelancer = user?.roles[0]?.toLowerCase() === "freelancer";

  return isFreelancer ? <FreelancerDashboard /> : <ClientDashboard />;
}
