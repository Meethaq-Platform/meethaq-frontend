"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { useApproveContract } from "../hooks/useApproveContract";
import Button from "@/src/shared/components/Button";
import ConfirmModal from "@/src/shared/components/ConfirmModal";
import { useErrorText } from "@/src/shared/hooks/useApiMessage";

interface ApproveContractButtonProps {
  projectId: string;
  concurrencyToken: string | null;
}

export function ApproveContractButton({
  projectId,
  concurrencyToken,
}: ApproveContractButtonProps) {
  const t = useTranslations("clientContracts.approve");
  const errorText = useErrorText();
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
        {t("button")}
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
        title={t("title")}
        description={t("description")}
        confirmLabel={t("confirm")}
        confirmingLabel={t("confirming")}
        variant="primary"
        isConfirming={isPending}
        errorMessage={
          isError
            ? errorText(error, t("failed"))
            : undefined
        }
      />
    </>
  );
}
