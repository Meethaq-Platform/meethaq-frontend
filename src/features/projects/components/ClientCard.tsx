"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Project } from "../types/project";
import { AssignClientControl } from "./AssignClientControl";
import Button from "@/src/shared/components/Button";

interface ClientCardProps {
  project: Project;
  canEdit: boolean;
}

// The "no client" empty state intentionally doesn't reuse the shared
// EmptyState component here — EmptyState draws its own card chrome
// (border/bg/rounded), which would double up with this card's own wrapper.
export function ClientCard({ project, canEdit }: ClientCardProps) {
  const t = useTranslations("projects.clientCard");
  const [isAssigning, setIsAssigning] = useState(false);

  return (
    <div className="bg-surface p-6 border border-border rounded-2xl">
      <p className="mb-4 font-semibold text-text-secondary text-xs uppercase tracking-wide">
        {t("title")}
      </p>

      {project.clientId ? (
        <AssignClientControl
          projectId={project.id}
          clientId={project.clientId}
          clientName={project.clientName}
        />
      ) : !canEdit ? (
        <p className="text-text-secondary text-sm">{t("unassigned")}</p>
      ) : isAssigning ? (
        <AssignClientControl projectId={project.id} clientId={null} clientName={null} />
      ) : (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <div className="flex justify-center items-center bg-surface-muted mb-1 rounded-full w-12 h-12 text-text-secondary">
            <Users size={20} />
          </div>
          <p className="font-semibold text-text-primary text-sm">{t("emptyTitle")}</p>
          <p className="max-w-xs text-text-secondary text-sm">
            {t("emptyDescription")}
          </p>
          <Button
            type="button"
            onClick={() => setIsAssigning(true)}
            className="mt-2 h-9"
          >
            {t("assign")}
          </Button>
        </div>
      )}
    </div>
  );
}
