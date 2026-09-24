"use client";

import { BellRing } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRemindClient } from "../hooks/useRemindClient";

interface RemindClientButtonProps {
  projectId: string;
  milestoneId: string;
  submissionId: number;
}

// Freelancer-only nudge for an overdue review (Module 5) — the backend
// rate-limits repeat reminders (429), surfaced via the global mutation
// error toast rather than inline UI.
export function RemindClientButton({
  projectId,
  milestoneId,
  submissionId,
}: RemindClientButtonProps) {
  const t = useTranslations("submissions.remind");
  const remind = useRemindClient(projectId, milestoneId);

  return (
    <button
      type="button"
      onClick={() => remind.mutate(submissionId)}
      disabled={remind.isPending}
      className="flex items-center gap-1.5 hover:bg-surface-muted disabled:opacity-60 px-4 rounded-xl h-9 font-semibold text-text-secondary text-sm transition disabled:cursor-not-allowed"
    >
      <BellRing size={14} />
      {remind.isPending ? t("sending") : t("button")}
    </button>
  );
}
