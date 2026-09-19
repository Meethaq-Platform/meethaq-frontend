"use client";

import { useState } from "react";
import { Play } from "lucide-react";

import { useStartMilestone } from "../hooks/useStartMilestone";
import Button from "@/src/shared/components/Button";
import ConfirmModal from "@/src/shared/components/ConfirmModal";
import { getErrorMessage } from "@/src/shared/lib/getErrorMessage";

interface StartMilestoneButtonProps {
  projectId: string;
  milestoneId: number;
}

export function StartMilestoneButton({
  projectId,
  milestoneId,
}: StartMilestoneButtonProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending, isError, error } = useStartMilestone(projectId);

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 h-9"
      >
        <Play size={14} />
        Start Milestone
      </Button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => mutate(milestoneId, { onSuccess: () => setOpen(false) })}
        title="Start this milestone?"
        description="This marks the milestone as In Progress so you can begin work and submit deliverables for client review."
        confirmLabel="Yes, start"
        confirmingLabel="Starting..."
        variant="primary"
        isConfirming={isPending}
        errorMessage={isError ? getErrorMessage(error, "Failed to start milestone.") : undefined}
      />
    </>
  );
}
