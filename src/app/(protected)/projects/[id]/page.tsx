import { requireRole } from "@/src/features/auth/lib/requireRole";
import ProjectDetailPage from "@/src/features/projects/components/ProjectDetailPage";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("freelancer");

  const { id } = await params;

  return <ProjectDetailPage projectId={id} />;
}
