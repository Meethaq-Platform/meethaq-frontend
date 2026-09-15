"use client";

import Modal from "@/src/shared/components/Modal";
import { AddClientForm } from "./AddClientForm";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddClientModal({ open, onClose }: AddClientModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Add Client">
      <AddClientForm onSuccess={onClose} onCancel={onClose} />
    </Modal>
  );
}
