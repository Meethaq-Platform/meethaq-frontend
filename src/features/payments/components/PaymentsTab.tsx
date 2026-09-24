"use client";

import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import { usePaymentsSummary } from "../hooks/usePaymentsSummary";
import { PaymentMilestoneRow } from "./PaymentMilestoneRow";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import EmptyState from "@/src/shared/components/EmptyState";

interface PaymentsTabProps {
  projectId: string;
}

export function PaymentsTab({ projectId }: PaymentsTabProps) {
  const t = useTranslations("payments.tab");
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: summary, isLoading, isError, refetch } = usePaymentsSummary(projectId);

  if (isUserLoading || isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  if (isError || !summary) {
    return <ErrorState message={t("loadFailed")} onRetry={() => refetch()} />;
  }

  if (summary.milestones.length === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
      />
    );
  }

  const isFreelancer = user?.roles[0]?.toLowerCase() === "freelancer";
  const sorted = [...summary.milestones].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      {sorted.map((item) => (
        <PaymentMilestoneRow
          key={item.milestoneId}
          projectId={projectId}
          item={item}
          isFreelancer={isFreelancer}
        />
      ))}
    </div>
  );
}
