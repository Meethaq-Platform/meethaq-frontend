"use client";

import { useState } from "react";
import { FileEdit } from "lucide-react";

import { useChangeRequests } from "../hooks/useChangeRequests";
import { ChangeRequestStatusBadge } from "./ChangeRequestStatusBadge";
import { CreateChangeRequestModal } from "./CreateChangeRequestModal";
import { ChangeRequestDetailModal } from "./ChangeRequestDetailModal";
import { AmendmentHistoryList } from "./AmendmentHistoryList";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import EmptyState from "@/src/shared/components/EmptyState";
import { formatCurrency, formatDate } from "@/src/shared/lib/format";

interface ChangeRequestsTabProps {
  projectId: string;
}

export function ChangeRequestsTab({ projectId }: ChangeRequestsTabProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data, isLoading, isError, refetch } = useChangeRequests(projectId);

  const items = data?.pages.flatMap((page) => page?.items ?? []) ?? [];
  // MVP rule: only one pending change request per project at a time.
  const hasPending = items.some((item) => item.status === 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-text-primary text-base">Change Requests</h2>
        {!hasPending && <CreateChangeRequestModal projectId={projectId} />}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner size={28} />
        </div>
      ) : isError ? (
        <ErrorState message="Failed to load change requests." onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={FileEdit}
          title="No change requests yet"
          description="Either party can propose a change to scope, timeline, or cost once the contract is approved."
        />
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-3 hover:bg-surface-muted p-4 border-border border-b last:border-b-0 w-full text-left transition"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-text-primary text-sm truncate">
                  {item.title}
                </h3>
                <p className="mt-1 text-text-secondary text-xs">
                  Submitted {formatDate(item.submittedAt)} ·{" "}
                  {formatCurrency(item.resultingProjectValue)}
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
