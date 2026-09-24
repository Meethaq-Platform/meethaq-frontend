"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("payments.confirm");
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
        {t("button")}
      </Button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => mutate(undefined, { onSuccess: () => setOpen(false) })}
        title={t("title")}
        description={t("description")}
        confirmLabel={t("confirm")}
        confirmingLabel={t("confirming")}
        isConfirming={isPending}
        variant="primary"
        errorMessage={isError ? getErrorMessage(error, t("failed")) : undefined}
      />
    </>
  );
}
