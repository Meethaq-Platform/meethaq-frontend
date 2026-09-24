"use client";

import { useState } from "react";
import { PartyPopper } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCompleteProject } from "../hooks/useCompleteProject";
import Modal from "@/src/shared/components/Modal";
import Button from "@/src/shared/components/Button";
import Textarea from "@/src/shared/components/Textarea";
import InputError from "@/src/shared/components/InputError";
import { getErrorMessage } from "@/src/shared/lib/getErrorMessage";

interface CompleteProjectButtonProps {
  projectId: number;
}

// Freelancer-only, gated by the caller on status === "Active" &&
// contractStatus === "Approved" (a client-side hint only — the backend
// enforces the real completion checklist and returns a descriptive `errors`
// list, folded into the thrown message by completeProject(), when a
// condition like an unresolved dispute or pending change request remains).
export function CompleteProjectButton({
  projectId,
}: CompleteProjectButtonProps) {
  const t = useTranslations("projects.complete");
  const tActions = useTranslations("common.actions");
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const { mutate, isPending, isError, error } = useCompleteProject(
    String(projectId),
  );

  const handleClose = () => {
    setNotes("");
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 px-2.5 sm:px-3 h-6 sm:h-7 text-xs"
      >
        <PartyPopper size={13} />
        <span className="hidden sm:inline">{t("button")}</span>
        <span className="sm:hidden">{t("buttonShort")}</span>
      </Button>

      <Modal open={open} onClose={handleClose} title={t("title")}>
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            {t("description")}
          </p>

          <Textarea
            label={t("notes")}
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {isError && (
            <InputError
              message={getErrorMessage(error, t("failed"))}
            />
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="hover:bg-surface-muted disabled:opacity-60 px-4 rounded-xl h-11 font-semibold text-text-secondary text-sm transition disabled:cursor-not-allowed"
            >
              {tActions("cancel")}
            </button>

            <Button
              type="button"
              loading={isPending}
              loadingText={t("confirming")}
              onClick={() =>
                mutate(
                  { completionNotes: notes || undefined },
                  { onSuccess: handleClose },
                )
              }
            >
              {t("confirm")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
