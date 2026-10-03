import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProjectsEntry from "@/src/features/projects/components/ProjectsEntry";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pageTitles");
  return { title: t("projects") };
}

export default function Projects() {
  return (
    <div className="space-y-6 mx-auto h-full">
      <ProjectsEntry />
    </div>
  );
}
