"use client";

import { useState } from "react";
import { ListChecks, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { useReorderMilestones } from "../hooks/useReorderMilestones";
import { MilestoneRow } from "./MilestoneRow";
import { MilestoneFormModal } from "./MilestoneFormModal";
import type { Contract, Milestone } from "../types/contract";
import EmptyState from "@/src/shared/components/EmptyState";

interface MilestonesSectionProps {
  projectId: string;
  contract: Contract;
  editable: boolean;
}

export function MilestonesSection({
  projectId,
  contract,
  editable,
}: MilestonesSectionProps) {
  const t = useTranslations("contracts.milestones");
  const [formState, setFormState] = useState<
    { open: false } | { open: true; milestone?: Milestone }
  >({ open: false });

  const reorderMilestones = useReorderMilestones(projectId);
  const milestones = [...contract.milestones].sort((a, b) => a.order - b.order);

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= milestones.length) return;

    const reordered = [...milestones];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];

    reorderMilestones.mutate(reordered.map((milestone) => milestone.id));
  };

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center bg-primary-muted p-6 pb-4">
        <h2 className="font-semibold text-text-primary text-base">
          {t("title")}
        </h2>

        {editable && (
          <button
            type="button"
            onClick={() => setFormState({ open: true })}
            className="flex items-center gap-1.5 hover:bg-primary-muted px-3 rounded-lg h-8 font-semibold text-primary text-sm transition"
          >
            <Plus size={14} />
            {t("add")}
          </button>
        )}
      </div>

      {milestones.length === 0 ? (
        <div className="px-6 pb-6">
          <EmptyState
            icon={ListChecks}
            title={t("emptyTitle")}
            description={t("emptyDescription")}
          />
        </div>
      ) : (
        <div className="border-border border-t">
          {milestones.map((milestone, index) => (
            <MilestoneRow
              key={milestone.id}
              projectId={projectId}
              milestone={milestone}
              allocationMode={contract.allocationMode}
              editable={editable}
              isFirst={index === 0}
              isLast={index === milestones.length - 1}
              isReordering={reorderMilestones.isPending}
              onEdit={() => setFormState({ open: true, milestone })}
              onMove={(direction) => handleMove(index, direction)}
            />
          ))}
        </div>
      )}

      {formState.open && (
        <MilestoneFormModal
          open
          onClose={() => setFormState({ open: false })}
          projectId={projectId}
          allocationMode={contract.allocationMode}
          milestone={formState.milestone}
        />
      )}
    </div>
  );
}
