"use client";

import { useState } from "react";
import { ShieldAlert } from "lucide-react";

import { useDisputes } from "../hooks/useDisputes";
import { DisputeStatusBadge } from "./DisputeStatusBadge";
import { DisputeCategoryBadge } from "./DisputeCategoryBadge";
import { OpenDisputeModal } from "./OpenDisputeModal";
import { DisputeDetailModal } from "./DisputeDetailModal";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";
import EmptyState from "@/src/shared/components/EmptyState";
import { formatDateTime } from "@/src/shared/lib/format";

interface DisputesTabProps {
  projectId: string;
}

export function DisputesTab({ projectId }: DisputesTabProps) {
  const [selected, setSelected] = useState<{ milestoneId: string; disputeId: number } | null>(
    null,
  );
  const { data, isLoading, isError, refetch } = useDisputes(projectId);

  const items = data?.pages.flatMap((page) => page?.items ?? []) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-text-primary text-base">Disputes</h2>
        <OpenDisputeModal projectId={projectId} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner size={28} />
        </div>
      ) : isError ? (
        <ErrorState message="Failed to load disputes." onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No disputes"
          description="If a disagreement comes up on a milestone, either party can open a dispute here."
        />
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setSelected({ milestoneId: String(item.milestoneId), disputeId: item.id })
              }
              className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-3 hover:bg-surface-muted p-4 border-border border-b last:border-b-0 w-full text-start transition"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-text-primary text-sm truncate">
                  {item.milestoneTitle}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <DisputeCategoryBadge category={item.category} />
                  <span className="text-text-secondary text-xs">
                    Opened {formatDateTime(item.openedAt)}
                  </span>
                </div>
              </div>
              <DisputeStatusBadge status={item.status} />
            </button>
          ))}
        </div>
      )}

      <DisputeDetailModal
        projectId={projectId}
        milestoneId={selected?.milestoneId ?? null}
        disputeId={selected?.disputeId ?? null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
