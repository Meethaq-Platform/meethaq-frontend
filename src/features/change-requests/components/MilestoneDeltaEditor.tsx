"use client";

import { X } from "lucide-react";
import type { MilestoneDeltaInput } from "../types/change-request";
import type { ContractAllocationMode } from "@/src/features/contracts/types/contract";
import Input from "@/src/shared/components/Input";
import Textarea from "@/src/shared/components/Textarea";

interface MilestoneDeltaEditorProps {
  milestoneTitle: string;
  allocationMode: ContractAllocationMode;
  value: MilestoneDeltaInput;
  onChange: (next: MilestoneDeltaInput) => void;
  onRemove: () => void;
}

// One row per affected milestone — pre-filled with that milestone's current
// terms (by the caller), edited here as the party's proposed replacement
// terms, mirroring the sprint doc's "Current Agreed Details / Proposed
// Deliverables or Acceptance Criteria / Proposed Date Changes / Proposed
// Cost" structure.
export function MilestoneDeltaEditor({
  milestoneTitle,
  allocationMode,
  value,
  onChange,
  onRemove,
}: MilestoneDeltaEditorProps) {
  return (
    <div className="space-y-3 bg-surface-muted p-4 rounded-xl">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-text-primary text-sm">{milestoneTitle}</p>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${milestoneTitle} from this change request`}
          className="text-text-secondary hover:text-danger transition"
        >
          <X size={16} />
        </button>
      </div>

      <Input
        label="Title"
        value={value.title}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
      />

      <Textarea
        label="Description"
        rows={2}
        value={value.description ?? ""}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />

      <Textarea
        label="Deliverable"
        rows={2}
        value={value.deliverable}
        onChange={(e) => onChange({ ...value, deliverable: e.target.value })}
      />

      <Textarea
        label="Acceptance Criteria"
        rows={2}
        value={value.acceptanceCriteria}
        onChange={(e) => onChange({ ...value, acceptanceCriteria: e.target.value })}
      />

      <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
        {allocationMode === 1 ? (
          <Input
            type="number"
            step="0.01"
            label="Allocation (%)"
            value={value.percentage ?? ""}
            onChange={(e) => onChange({ ...value, percentage: Number(e.target.value) })}
          />
        ) : (
          <Input
            type="number"
            step="0.01"
            label="Amount"
            value={value.amount ?? ""}
            onChange={(e) => onChange({ ...value, amount: Number(e.target.value) })}
          />
        )}

        <Input
          type="date"
          label="Due Date"
          value={value.dueDate.slice(0, 10)}
          onChange={(e) => onChange({ ...value, dueDate: e.target.value })}
        />
      </div>
    </div>
  );
}
