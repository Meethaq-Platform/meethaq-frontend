import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { requireRole } from "@/src/features/auth/lib/requireRole";
import { ClientsHeader } from "@/src/features/clients/components/ClientsHeader";
import ClientsPage from "@/src/features/clients/components/ClientsPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pageTitles");
  return { title: t("clients") };
}

export default async function Clients() {
  await requireRole("freelancer");

  return (
    <div className="space-y-6 mx-auto h-full">
      <ClientsHeader />
      <ClientsPage />
    </div>
  );
}
