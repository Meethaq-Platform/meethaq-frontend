"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";

import { useValidateContract } from "../hooks/useValidateContract";
import { useSubmitContract } from "../hooks/useSubmitContract";
import type { ContractValidationErrorItem } from "../types/contract";
import Modal from "@/src/shared/components/Modal";
import Button from "@/src/shared/components/Button";
import InputError from "@/src/shared/components/InputError";

export function SubmitContractButton({ projectId }: { projectId: string }) {
  const t = useTranslations("contracts.submit");
  const tActions = useTranslations("common.actions");
  const [open, setOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    ContractValidationErrorItem[] | null
  >(null);

  const validateContract = useValidateContract(projectId);
  const submitContract = useSubmitContract(projectId);

  const openModal = () => {
    setValidationErrors(null);
    setOpen(true);
    validateContract.mutate(undefined, {
      onSuccess: (response) => {
        setValidationErrors(response.data?.errors ?? []);
      },
    });
  };

  const handleSubmit = () => {
    submitContract.mutate(undefined, { onSuccess: () => setOpen(false) });
  };

  const isChecking = validateContract.isPending;
  const isReady = !isChecking && validationErrors?.length === 0;

  return (
    <>
      <Button
        type="button"
        onClick={openModal}
        className="flex items-center gap-1.5 h-9"
      >
        <Send size={14} className="rtl-flip" />
        {t("button")}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("title")}
      >
        <div className="space-y-4">
          {isChecking && (
            <p className="text-text-secondary text-sm">
              {t("checking")}
            </p>
          )}

          {validateContract.isError && (
            <InputError
              message={
                validateContract.error instanceof Error
                  ? validateContract.error.message
                  : t("validateFailed")
              }
            />
          )}

          {!isChecking && validationErrors && validationErrors.length > 0 && (
            <div className="space-y-2">
              <p className="text-text-primary text-sm">
                {t("notReady")}
              </p>
              <ul className="space-y-1.5">
                {validationErrors.map((error, index) => (
                  <li key={index}>
                    <InputError message={error.message ?? t("invalid")} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isReady && (
            <p className="text-text-secondary text-sm">
              {t("ready")}
            </p>
          )}

          {submitContract.isError && (
            <InputError
              message={
                submitContract.error instanceof Error
                  ? submitContract.error.message
                  : t("failed")
              }
            />
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={submitContract.isPending}
              className="hover:bg-surface-muted disabled:opacity-60 px-4 rounded-xl h-11 font-semibold text-text-secondary text-sm transition disabled:cursor-not-allowed"
            >
              {tActions("cancel")}
            </button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!isReady}
              loading={submitContract.isPending}
              loadingText={t("confirming")}
            >
              {t("confirm")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
