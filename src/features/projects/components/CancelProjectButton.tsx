"use client";

import { useState } from "react";
import { Ban } from "lucide-react";

import { useCancelProject } from "../hooks/useCancelProject";
import ConfirmModal from "@/src/shared/components/ConfirmModal";

interface CancelProjectButtonProps {
  projectId: number;
}

export function CancelProjectButton({ projectId }: CancelProjectButtonProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending, isError, error } = useCancelProject(
    String(projectId),
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 hover:bg-danger-muted px-3 sm:px-4 rounded-xl h-8 sm:h-9 font-semibold text-danger text-xs sm:text-sm transition"
      >
        <Ban size={14} className="sm:size-4 size-3.5" />
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
