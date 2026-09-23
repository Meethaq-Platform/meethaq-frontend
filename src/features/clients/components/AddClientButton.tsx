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
        className="flex items-center gap-1.5 shrink-0 h-9 sm:h-11 px-3 sm:px-4 text-xs sm:text-sm"
      >
        <Plus size={14} className="sm:size-4 size-3.5" />
        Add Client
      </Button>

      <AddClientModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
