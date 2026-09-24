import type { Metadata } from "next";
import ProjectsEntry from "@/src/features/projects/components/ProjectsEntry";

export const metadata: Metadata = { title: "Projects" };

export default function Projects() {
  return (
    <div className="space-y-6 mx-auto h-full">
      <ProjectsEntry />
    </div>
  );
}
