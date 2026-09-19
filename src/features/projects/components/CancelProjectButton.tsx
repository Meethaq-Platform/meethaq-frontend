"use client";

import { useState } from "react";
import { Ban } from "lucide-react";

import { useCancelProject } from "../hooks/useCancelProject";
import ConfirmModal from "@/src/shared/components/ConfirmModal";

interface CancelProjectButtonProps {
  projectId: number;
  // Called when the trigger is clicked, before the confirm modal opens —
  // lets the parent overflow menu close itself so the menu and the modal
  // don't both sit open at once.
  onTriggerClick?: () => void;
}

export function CancelProjectButton({
  projectId,
  onTriggerClick,
}: CancelProjectButtonProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending, isError, error } = useCancelProject(
    String(projectId),
  );

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onTriggerClick?.();
          setOpen(true);
        }}
        className="flex items-center gap-3 hover:bg-danger-muted px-4 w-full h-11 text-danger text-sm transition"
      >
        <Ban size={16} />
        Cancel Project
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => mutate(undefined, { onSuccess: () => setOpen(false) })}
        title="Cancel this project?"
        description="This will mark the project as cancelled. You won't be able to undo this."
        confirmLabel="Yes, cancel project"
        confirmingLabel="Cancelling..."
        cancelLabel="Keep it"
        isConfirming={isPending}
        errorMessage={
          isError
            ? error instanceof Error
              ? error.message
              : "Failed to cancel project."
            : undefined
        }
      />
    </>
  );
}
