"use client";

import Modal from "@/src/shared/components/Modal";
import { AddProjectForm } from "./AddProjectForm";

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddProjectModal({ open, onClose }: AddProjectModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Create Project">
      <AddProjectForm onSuccess={onClose} onCancel={onClose} />
    </Modal>
  );
}
