"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { useDeleteContract } from "../hooks/useDeleteContract";
import ConfirmModal from "@/src/shared/components/ConfirmModal";

export function DeleteContractButton({ projectId }: { projectId: string }) {
  const t = useTranslations("contracts.delete");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutate, isPending, isError, error } = useDeleteContract(projectId);

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
            onSuccess: () => {
              setOpen(false);
              router.push(`/projects/${projectId}`);
            },
          })
        }
        title={t("title")}
        description={t("description")}
        confirmLabel={t("confirm")}
        confirmingLabel={t("confirming")}
        isConfirming={isPending}
        errorMessage={
          isError
            ? error instanceof Error
              ? error.message
              : t("failed")
            : undefined
        }
      />
    </>
  );
}
