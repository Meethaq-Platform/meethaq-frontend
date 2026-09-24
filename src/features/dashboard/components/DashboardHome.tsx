"use client";

import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import Spinner from "@/src/shared/components/Spinner";
import FreelancerDashboard from "./FreelancerDashboard";
import ClientDashboard from "./ClientDashboard";

// Feature 1: Login → Detect Role → Open Role-Based Home.
export default function DashboardHome() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  const isFreelancer = user?.roles[0]?.toLowerCase() === "freelancer";

  return isFreelancer ? <FreelancerDashboard /> : <ClientDashboard />;
}
