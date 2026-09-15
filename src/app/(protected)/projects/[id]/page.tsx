import ProjectDetailEntry from "@/src/features/projects/components/ProjectDetailEntry";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProjectDetailEntry projectId={id} />;
}
