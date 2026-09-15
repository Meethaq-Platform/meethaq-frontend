"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";

import { useDeleteMilestone } from "../hooks/useDeleteMilestone";
import type { ContractAllocationMode, Milestone } from "../types/contract";
import { formatCurrency, formatDate } from "@/src/shared/lib/format";
import ConfirmModal from "@/src/shared/components/ConfirmModal";

interface MilestoneRowProps {
  projectId: string;
  milestone: Milestone;
  allocationMode: ContractAllocationMode;
  editable: boolean;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onMove: (direction: "up" | "down") => void;
  isReordering: boolean;
}

export function MilestoneRow({
  projectId,
  milestone,
  allocationMode,
  editable,
  isFirst,
  isLast,
  onEdit,
  onMove,
  isReordering,
}: MilestoneRowProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteMilestone = useDeleteMilestone(projectId);

  return (
    <div className="flex sm:flex-row flex-col gap-4 p-4 border-border border-b last:border-b-0">
      {editable && (
        <div className="flex sm:flex-col flex-row items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onMove("up")}
            disabled={isFirst || isReordering}
            aria-label="Move up"
            className="hover:bg-surface-muted disabled:opacity-30 p-1.5 rounded-lg text-text-secondary transition disabled:cursor-not-allowed"
          >
            <ArrowUp size={14} />
          </button>
          <span className="font-numbers text-text-secondary text-xs">
            {milestone.order}
          </span>
          <button
            type="button"
            onClick={() => onMove("down")}
            disabled={isLast || isReordering}
            aria-label="Move down"
            className="hover:bg-surface-muted disabled:opacity-30 p-1.5 rounded-lg text-text-secondary transition disabled:cursor-not-allowed"
          >
            <ArrowDown size={14} />
          </button>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-semibold text-text-primary text-sm">
            {milestone.title}
          </h3>

          <div className="text-right shrink-0">
            <p className="font-numbers font-semibold text-text-primary text-sm">
              {formatCurrency(milestone.calculatedAmount)}
            </p>
            <p className="text-text-secondary text-xs">
              {allocationMode === 1
                ? `${milestone.allocationValue}%`
                : "fixed"}
            </p>
          </div>
        </div>

        {milestone.description && (
          <p className="mt-1 text-text-secondary text-sm whitespace-pre-wrap">
            {milestone.description}
          </p>
        )}

        <div className="gap-x-6 gap-y-1 grid grid-cols-1 sm:grid-cols-2 mt-3 text-xs">
          <p className="text-text-secondary">
            <span className="font-medium text-text-primary">Deliverable:</span>{" "}
            {milestone.deliverable}
          </p>
          <p className="text-text-secondary">
            <span className="font-medium text-text-primary">Due:</span>{" "}
            {formatDate(milestone.dueDate)}
          </p>
          <p className="sm:col-span-2 text-text-secondary">
            <span className="font-medium text-text-primary">
              Acceptance Criteria:
            </span>{" "}
            {milestone.acceptanceCriteria}
          </p>
        </div>

        {editable && (
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 font-medium text-primary text-xs hover:underline"
            >
              <Pencil size={12} />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="flex items-center gap-1.5 font-medium text-danger text-xs hover:underline"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() =>
          deleteMilestone.mutate(milestone.id, {
            onSuccess: () => setIsDeleteOpen(false),
          })
        }
        title="Delete this milestone?"
        description={`"${milestone.title}" will be removed and remaining milestones will be re-indexed.`}
        confirmLabel="Yes, delete"
        confirmingLabel="Deleting..."
        isConfirming={deleteMilestone.isPending}
        errorMessage={
          deleteMilestone.isError
            ? deleteMilestone.error instanceof Error
              ? deleteMilestone.error.message
              : "Failed to delete milestone."
            : undefined
        }
      />
    </div>
  );
}
