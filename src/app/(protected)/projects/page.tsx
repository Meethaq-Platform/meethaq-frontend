import { requireRole } from "@/src/features/auth/lib/requireRole";
import { ProjectsHeader } from "@/src/features/projects/components/ProjectsHeader";
import ProjectsPage from "@/src/features/projects/components/ProjectsPage";

export default async function Projects() {
  await requireRole("freelancer");

  return (
    <div className="space-y-6 mx-auto h-full">
      <ProjectsHeader />
      <ProjectsPage />
    </div>
  );
}
