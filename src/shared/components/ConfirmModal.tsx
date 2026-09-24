"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import Modal from "./Modal";
import InputError from "./InputError";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  confirmingLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  variant?: "danger" | "amber" | "primary";
  errorMessage?: string;
}

const variantBg: Record<NonNullable<ConfirmModalProps["variant"]>, string> = {
  danger: "bg-danger text-white",
  amber: "bg-accent-value text-on-accent-value",
  primary: "bg-primary text-on-primary",
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  confirmingLabel,
  cancelLabel,
  isConfirming = false,
  variant = "danger",
  errorMessage,
}: ConfirmModalProps) {
  const t = useTranslations("common.actions");
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-5">
        {description && (
          <p className="text-text-secondary text-sm">{description}</p>
        )}

        {errorMessage && <InputError message={errorMessage} />}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isConfirming}
            className="hover:bg-surface-muted disabled:opacity-60 px-4 rounded-xl h-11 font-semibold text-text-secondary text-sm transition disabled:cursor-not-allowed"
          >
            {cancelLabel ?? t("cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className={`${variantBg[variant]} hover:opacity-90 disabled:opacity-60 px-4 rounded-xl h-11 font-semibold text-sm transition disabled:cursor-not-allowed`}
          >
            {isConfirming ? (confirmingLabel ?? t("pleaseWait")) : (confirmLabel ?? t("confirm"))}
          </button>
        </div>
      </div>
    </Modal>
  );
}
