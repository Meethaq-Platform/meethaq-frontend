"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { useDeleteContract } from "../hooks/useDeleteContract";
import ConfirmModal from "@/src/shared/components/ConfirmModal";
import { useErrorText } from "@/src/shared/hooks/useApiMessage";

export function DeleteContractButton({ projectId }: { projectId: string }) {
  const t = useTranslations("contracts.delete");
  const errorText = useErrorText();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutate, isPending, isError, error } = useDeleteContract(projectId);
  // Keeps the dialog busy until the project page renders, not just until the
  // request resolves.
  const [isRedirecting, startRedirect] = useTransition();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 hover:bg-danger-muted px-4 rounded-xl h-9 font-semibold text-danger text-sm transition"
      >
        <Trash2 size={14} />
        {t("button")}
      </button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() =>
          mutate(undefined, {
            onSuccess: () =>
              startRedirect(() => {
                setOpen(false);
                router.push(`/projects/${projectId}`);
              }),
          })
        }
        title={t("title")}
        description={t("description")}
        confirmLabel={t("confirm")}
        confirmingLabel={t("confirming")}
        isConfirming={isPending || isRedirecting}
        errorMessage={
          isError
            ? errorText(error, t("failed"))
            : undefined
        }
      />
    </>
  );
}
