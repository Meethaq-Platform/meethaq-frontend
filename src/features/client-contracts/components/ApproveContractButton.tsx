"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { useApproveContract } from "../hooks/useApproveContract";
import Button from "@/src/shared/components/Button";
import ConfirmModal from "@/src/shared/components/ConfirmModal";

interface ApproveContractButtonProps {
  projectId: string;
  concurrencyToken: string | null;
}

export function ApproveContractButton({
  projectId,
  concurrencyToken,
}: ApproveContractButtonProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending, isError, error } = useApproveContract(projectId);

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 h-9"
      >
        <Check size={14} />
        Approve Contract
      </Button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          if (!concurrencyToken) return;
          mutate(
            { reviewVersion: concurrencyToken },
            { onSuccess: () => setOpen(false) },
          );
        }}
        title="Approve this contract?"
        description="This permanently locks in the agreement details. You won't be able to request changes after approving."
        confirmLabel="Yes, approve"
        confirmingLabel="Approving..."
        variant="primary"
        isConfirming={isPending}
        errorMessage={
          isError
            ? error instanceof Error
              ? error.message
              : "Failed to approve contract."
            : undefined
        }
      />
    </>
  );
}
