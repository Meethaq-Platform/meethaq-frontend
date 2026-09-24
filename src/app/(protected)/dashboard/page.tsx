import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import DashboardHome from "@/src/features/dashboard/components/DashboardHome";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pageTitles");
  return { title: t("dashboard") };
}

export default function Dashboard() {
  return <DashboardHome />;
}
