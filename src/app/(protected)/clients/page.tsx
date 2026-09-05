import { requireRole } from "@/src/features/auth/lib/requireRole";
import { ClientsHeader } from "@/src/features/clients/components/ClientsHeader";
import ClientsPage from "@/src/features/clients/components/ClientsPage";

export default async function Clients() {
  await requireRole("freelancer");

  return (
    <div className="space-y-6 mx-auto h-full">
      <ClientsHeader />
      <ClientsPage />
    </div>
  );
}
