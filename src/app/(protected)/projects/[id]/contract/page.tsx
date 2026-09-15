import ContractPageEntry from "@/src/features/contracts/components/ContractPageEntry";

export default async function ProjectContract({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ContractPageEntry projectId={id} />;
}
