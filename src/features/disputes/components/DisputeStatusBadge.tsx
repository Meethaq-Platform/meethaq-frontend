import { useTranslations } from "next-intl";

import type { DisputeStatus } from "../types/dispute";
import { useStatusLabel } from "@/src/shared/hooks/useStatusLabel";

const statusStyles: Record<DisputeStatus, string> = {
  0: "bg-danger-muted text-danger",
  1: "bg-warning-muted text-warning",
  2: "bg-success-muted text-success",
  3: "bg-surface-muted text-text-secondary",
};

export function DisputeStatusBadge({ status }: { status: DisputeStatus }) {
  const label = useStatusLabel("dispute");
  const t = useTranslations("status");

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        statusStyles[status] ?? statusStyles[0]
      }`}
    >
      {label(status, t("unknown", { value: status }))}
    </span>
  );
}
