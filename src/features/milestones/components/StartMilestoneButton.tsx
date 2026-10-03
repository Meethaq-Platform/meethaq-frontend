"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";

import { useStartMilestone } from "../hooks/useStartMilestone";
import Button from "@/src/shared/components/Button";
import ConfirmModal from "@/src/shared/components/ConfirmModal";
import { useErrorText } from "@/src/shared/hooks/useApiMessage";

interface StartMilestoneButtonProps {
  projectId: string;
  milestoneId: number;
}

export function StartMilestoneButton({
  projectId,
  milestoneId,
}: StartMilestoneButtonProps) {
  const t = useTranslations("milestones.start");
  const errorText = useErrorText();
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
        {t("button")}
      </Button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => mutate(milestoneId, { onSuccess: () => setOpen(false) })}
        title={t("title")}
        description={t("description")}
        confirmLabel={t("confirm")}
        confirmingLabel={t("confirming")}
        variant="primary"
        isConfirming={isPending}
        errorMessage={isError ? errorText(error, t("failed")) : undefined}
      />
    </>
  );
}
