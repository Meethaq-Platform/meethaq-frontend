import type { Metadata } from "next";
import DashboardHome from "@/src/features/dashboard/components/DashboardHome";

export const metadata: Metadata = { title: "Dashboard" };

export default function Dashboard() {
  return <DashboardHome />;
}
