"use client";

import { useState } from "react";
import { FileEdit } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormat } from "@/src/shared/hooks/useFormat";

import { useChangeRequests } from "../hooks/useChangeRequests";
import { ChangeRequestStatusBadge } from "./ChangeRequestStatusBadge";
import { CreateChangeRequestModal } from "./CreateChangeRequestModal";
import { ChangeRequestDetailModal } from "./ChangeRequestDetailModal";
import { AmendmentHistoryList } from "./AmendmentHistoryList";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import EmptyState from "@/src/shared/components/EmptyState";
import { formatCurrency } from "@/src/shared/lib/format";

interface ChangeRequestsTabProps {
  projectId: string;
}

export function ChangeRequestsTab({ projectId }: ChangeRequestsTabProps) {
  const t = useTranslations("changeRequests.tab");
  const format = useFormat();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data, isLoading, isError, refetch } = useChangeRequests(projectId);

  const items = data?.pages.flatMap((page) => page?.items ?? []) ?? [];
  // MVP rule: only one pending change request per project at a time.
  const hasPending = items.some((item) => item.status === 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-text-primary text-base">{t("title")}</h2>
        {!hasPending && <CreateChangeRequestModal projectId={projectId} />}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner size={28} />
        </div>
      ) : isError ? (
        <ErrorState message={t("loadFailed")} onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={FileEdit}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-3 hover:bg-surface-muted p-4 border-border border-b last:border-b-0 w-full text-start transition"
            >
              <div className="min-w-0">
                <h3 dir="auto" className="font-semibold text-text-primary text-sm truncate">
                  {item.title}
                </h3>
                <p className="mt-1 text-text-secondary text-xs">
                  {t("submitted", { date: format.date(item.submittedAt) })} ·{" "}
                  <bdi>{formatCurrency(item.resultingProjectValue)}</bdi>
                </p>
              </div>
              <ChangeRequestStatusBadge status={item.status} />
            </button>
          ))}
        </div>
      )}

      <AmendmentHistoryList projectId={projectId} />

      <ChangeRequestDetailModal
        projectId={projectId}
        changeRequestId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
