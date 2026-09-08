"use client";

import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import { ProjectsHeader } from "./ProjectsHeader";
import ProjectsPage from "./ProjectsPage";
import { ClientProjectsHeader } from "@/src/features/client-projects/components/ClientProjectsHeader";
import ClientProjectsPage from "@/src/features/client-projects/components/ClientProjectsPage";
import Spinner from "@/src/shared/components/Spinner";

export default function ProjectsEntry() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  const isFreelancer = user?.roles[0]?.toLowerCase() === "freelancer";

  if (isFreelancer) {
    return (
      <>
        <ProjectsHeader />
        <ProjectsPage />
      </>
    );
  }

  return (
    <>
      <ClientProjectsHeader />
      <ClientProjectsPage />
    </>
  );
}
