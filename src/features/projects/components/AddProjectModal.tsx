"use client";

import { useTranslations } from "next-intl";
import Modal from "@/src/shared/components/Modal";
import { AddProjectForm } from "./AddProjectForm";

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddProjectModal({ open, onClose }: AddProjectModalProps) {
  const t = useTranslations("projects.form");

  return (
    <Modal open={open} onClose={onClose} title={t("createTitle")}>
      <AddProjectForm onSuccess={onClose} onCancel={onClose} />
    </Modal>
  );
}
