"use client";

import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import { MilestoneWorkspacePage } from "./MilestoneWorkspacePage";
import { MilestoneReviewPage } from "@/src/features/client-submissions/components/MilestoneReviewPage";
import Spinner from "@/src/shared/components/Spinner";

interface MilestoneDetailEntryProps {
  projectId: string;
  milestoneId: string;
}

export default function MilestoneDetailEntry({
  projectId,
  milestoneId,
}: MilestoneDetailEntryProps) {
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
    <MilestoneWorkspacePage projectId={projectId} milestoneId={milestoneId} />
  ) : (
    <MilestoneReviewPage projectId={projectId} milestoneId={milestoneId} />
  );
}
