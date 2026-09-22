"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { useConfirmReceipt } from "../hooks/useConfirmReceipt";
import Button from "@/src/shared/components/Button";
import ConfirmModal from "@/src/shared/components/ConfirmModal";
import { getErrorMessage } from "@/src/shared/lib/getErrorMessage";

interface ConfirmReceiptButtonProps {
  projectId: string;
  milestoneId: string;
}

// Freelancer-only action, shown once a payment is AwaitingConfirmation.
// Strictly restricted server-side to the owning Freelancer — this button
// only ever renders on that role's own views, but the backend is the real
// gate against a duplicate/spoofed confirmation either way.
export function ConfirmReceiptButton({ projectId, milestoneId }: ConfirmReceiptButtonProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending, isError, error } = useConfirmReceipt(projectId, milestoneId);

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 h-9"
      >
        <CheckCircle2 size={14} />
        Confirm Receipt
      </Button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => mutate(undefined, { onSuccess: () => setOpen(false) })}
        title="Confirm you received this payment?"
        description="This records your confirmation and marks the milestone as Paid. A confirmed payment cannot be reversed or edited afterward."
        confirmLabel="Yes, I received it"
        confirmingLabel="Confirming..."
        isConfirming={isPending}
        variant="primary"
        errorMessage={isError ? getErrorMessage(error, "Failed to confirm receipt.") : undefined}
      />
    </>
  );
}
