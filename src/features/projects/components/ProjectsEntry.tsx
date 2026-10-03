"use client";

import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import { ProjectsHeader } from "./ProjectsHeader";
import ProjectsPage from "./ProjectsPage";
import { ClientProjectsHeader } from "@/src/features/client-projects/components/ClientProjectsHeader";
import ClientProjectsPage from "@/src/features/client-projects/components/ClientProjectsPage";
import ListPageSkeleton from "@/src/shared/components/ListPageSkeleton";
import { ProjectsTableSkeleton } from "./ProjectsTable";

export default function ProjectsEntry() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <ListPageSkeleton filters={5}>
        <ProjectsTableSkeleton />
      </ListPageSkeleton>
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
