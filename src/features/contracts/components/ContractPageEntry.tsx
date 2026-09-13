"use client";

import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import ContractWorkspacePage from "./ContractWorkspacePage";
import ContractReviewPage from "@/src/features/client-contracts/components/ContractReviewPage";
import Spinner from "@/src/shared/components/Spinner";

interface ContractPageEntryProps {
  projectId: string;
}

export default function ContractPageEntry({ projectId }: ContractPageEntryProps) {
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
    <ContractWorkspacePage projectId={projectId} />
  ) : (
    <ContractReviewPage projectId={projectId} />
  );
}
