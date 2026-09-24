"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import Button from "@/src/shared/components/Button";
import { AddProjectModal } from "./AddProjectModal";

export function AddProjectButton() {
  const t = useTranslations("projects.header");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 shrink-0 h-9 sm:h-11 px-3 sm:px-4 text-xs sm:text-sm"
      >
        <Plus size={14} className="sm:size-4 size-3.5" />
        {t("newProject")}
      </Button>

      <AddProjectModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
