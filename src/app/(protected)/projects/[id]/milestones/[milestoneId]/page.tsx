import MilestoneDetailEntry from "@/src/features/milestones/components/MilestoneDetailEntry";

export default async function MilestoneDetail({
  params,
}: {
  params: Promise<{ id: string; milestoneId: string }>;
}) {
  const { id, milestoneId } = await params;

  return <MilestoneDetailEntry projectId={id} milestoneId={milestoneId} />;
}
