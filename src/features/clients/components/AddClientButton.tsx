"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import Button from "@/src/shared/components/Button";
import { AddClientModal } from "./AddClientModal";

export function AddClientButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 shrink-0"
      >
        <Plus size={16} />
        Add Client
      </Button>

      <AddClientModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
