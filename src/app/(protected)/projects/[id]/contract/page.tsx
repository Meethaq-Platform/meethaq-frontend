import { requireRole } from "@/src/features/auth/lib/requireRole";
import ContractWorkspacePage from "@/src/features/contracts/components/ContractWorkspacePage";

export default async function ProjectContract({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("freelancer");

  const { id } = await params;

  return <ContractWorkspacePage projectId={id} />;
}
