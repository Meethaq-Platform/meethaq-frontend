"use client";

import { useState } from "react";
import { Undo2 } from "lucide-react";

import { useWithdrawContract } from "../hooks/useWithdrawContract";
import ConfirmModal from "@/src/shared/components/ConfirmModal";

export function WithdrawContractButton({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending, isError, error } = useWithdrawContract(projectId);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 hover:bg-surface-muted px-4 rounded-xl h-9 font-semibold text-text-secondary text-sm transition"
      >
        <Undo2 size={14} className="rtl-flip" />
        Withdraw
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => mutate(undefined, { onSuccess: () => setOpen(false) })}
        title="Withdraw this contract?"
        description="The contract will return to Draft so you can make changes. Your client will no longer see it as pending their approval."
        confirmLabel="Yes, withdraw"
        confirmingLabel="Withdrawing..."
        variant="amber"
        isConfirming={isPending}
        errorMessage={
          isError
            ? error instanceof Error
              ? error.message
              : "Failed to withdraw contract."
            : undefined
        }
      />
    </>
  );
}
