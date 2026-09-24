"use client";

import { useTranslations } from "next-intl";
import Modal from "@/src/shared/components/Modal";
import { AddClientForm } from "./AddClientForm";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddClientModal({ open, onClose }: AddClientModalProps) {
  const t = useTranslations("clients.form");

  return (
    <Modal open={open} onClose={onClose} title={t("addTitle")}>
      <AddClientForm onSuccess={onClose} onCancel={onClose} />
    </Modal>
  );
}
