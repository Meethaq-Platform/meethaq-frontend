"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import Button from "@/src/shared/components/Button";
import { AddProjectModal } from "./AddProjectModal";

export function AddProjectButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 shrink-0"
      >
        <Plus size={16} />
        New Project
      </Button>

      <AddProjectModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
