"use client";

import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import { useFreelancerMilestonesList } from "../hooks/useFreelancerMilestonesList";
import { MilestonesListView } from "./MilestonesListView";
import { ClientMilestonesList } from "@/src/features/client-submissions/components/ClientMilestonesList";
import Spinner from "@/src/shared/components/Spinner";

interface MilestonesTabProps {
  projectId: string;
}

function FreelancerMilestonesList({ projectId }: { projectId: string }) {
  const { data, isLoading, isError, refetch } = useFreelancerMilestonesList(projectId);

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

// Role branch, matching ProjectDetailEntry/ContractPageEntry's pattern —
// there's no single "list milestones" endpoint, and the freelancer/client
// variants hit different (mirrored) backend routes.
export function MilestonesTab({ projectId }: MilestonesTabProps) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  const isFreelancer = user?.roles[0]?.toLowerCase() === "freelancer";

  return isFreelancer ? (
    <FreelancerMilestonesList projectId={projectId} />
  ) : (
    <ClientMilestonesList projectId={projectId} />
  );
}
