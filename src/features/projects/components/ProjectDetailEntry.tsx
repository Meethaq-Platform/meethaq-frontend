"use client";

import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import ProjectDetailPage from "./ProjectDetailPage";
import ClientProjectDetailPage from "@/src/features/client-projects/components/ClientProjectDetailPage";
import { ProjectDetailSkeleton } from "./ProjectDetailSkeleton";

interface ProjectDetailEntryProps {
  projectId: string;
}

export default function ProjectDetailEntry({
  projectId,
}: ProjectDetailEntryProps) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  const isFreelancer = user?.roles[0]?.toLowerCase() === "freelancer";

  return isFreelancer ? (
    <ProjectDetailPage projectId={projectId} />
  ) : (
    <ClientProjectDetailPage projectId={projectId} />
  );
}
