"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormat } from "@/src/shared/hooks/useFormat";

import { useDeleteMilestone } from "../hooks/useDeleteMilestone";
import type { ContractAllocationMode, Milestone } from "../types/contract";
import { formatCurrency } from "@/src/shared/lib/format";
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
  const t = useTranslations("contracts.milestones");
  const format = useFormat();
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
            aria-label={t("moveUp")}
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
            aria-label={t("moveDown")}
            className="hover:bg-surface-muted disabled:opacity-30 p-1.5 rounded-lg text-text-secondary transition disabled:cursor-not-allowed"
          >
            <ArrowDown size={14} />
          </button>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-3">
          <h3 dir="auto" className="font-semibold text-text-primary text-sm">
            {milestone.title}
          </h3>

          <div className="text-end shrink-0">
            <p className="font-numbers font-semibold text-text-primary text-sm">
              {formatCurrency(milestone.calculatedAmount)}
            </p>
            <p className="text-text-secondary text-xs">
              {allocationMode === 1
                ? `${milestone.allocationValue}%`
                : t("fixed")}
            </p>
          </div>
        </div>

        {milestone.description && (
          <p dir="auto" className="mt-1 text-text-secondary text-sm whitespace-pre-wrap">
            {milestone.description}
          </p>
        )}

        <div className="gap-x-6 gap-y-1 grid grid-cols-1 sm:grid-cols-2 mt-3 text-xs">
          <p className="text-text-secondary">
            <span className="font-medium text-text-primary">{t("deliverable")}</span>{" "}
            <bdi>{milestone.deliverable}</bdi>
          </p>
          <p className="text-text-secondary">
            <span className="font-medium text-text-primary">{t("due")}</span>{" "}
            {format.date(milestone.dueDate)}
          </p>
          <p className="sm:col-span-2 text-text-secondary">
            <span className="font-medium text-text-primary">
              {t("criteria")}
            </span>{" "}
            <bdi>{milestone.acceptanceCriteria}</bdi>
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
              {t("edit")}
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="flex items-center gap-1.5 font-medium text-danger text-xs hover:underline"
            >
              <Trash2 size={12} />
              {t("delete")}
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
        title={t("deleteTitle")}
        description={t.rich("deleteDescription", {
          title: milestone.title,
          bdi: (chunks) => <bdi>{chunks}</bdi>,
        })}
        confirmLabel={t("deleteConfirm")}
        confirmingLabel={t("deleting")}
        isConfirming={deleteMilestone.isPending}
        errorMessage={
          deleteMilestone.isError
            ? deleteMilestone.error instanceof Error
              ? deleteMilestone.error.message
              : t("deleteFailed")
            : undefined
        }
      />
    </div>
  );
}
