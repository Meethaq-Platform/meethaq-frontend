"use client";

import { useClientMilestonesList } from "../hooks/useClientMilestonesList";
import { MilestonesListView } from "@/src/features/milestones/components/MilestonesListView";

interface ClientMilestonesListProps {
  projectId: string;
}

export function ClientMilestonesList({ projectId }: ClientMilestonesListProps) {
  const { data, isLoading, isError, refetch } = useClientMilestonesList(projectId);

  return (
    <MilestonesListView
      projectId={projectId}
      milestones={data}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    />
  );
}
