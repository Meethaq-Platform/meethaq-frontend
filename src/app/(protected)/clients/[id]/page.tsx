import { requireRole } from "@/src/features/auth/lib/requireRole";
import ClientDetailPage from "@/src/features/clients/components/ClientDetailPage";

export default async function ClientDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("freelancer");

  const { id } = await params;

  return <ClientDetailPage clientId={id} />;
}
