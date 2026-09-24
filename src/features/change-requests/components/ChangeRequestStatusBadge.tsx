import { useTranslations } from "next-intl";

import type { ChangeRequestStatus } from "../types/change-request";
import { useStatusLabel } from "@/src/shared/hooks/useStatusLabel";

const statusStyles: Record<ChangeRequestStatus, string> = {
  0: "bg-surface-muted text-text-secondary",
  1: "bg-warning-muted text-warning",
  2: "bg-success-muted text-success",
  3: "bg-danger-muted text-danger",
  4: "bg-surface-muted text-text-secondary",
};

export function ChangeRequestStatusBadge({ status }: { status: ChangeRequestStatus }) {
  const label = useStatusLabel("changeRequest");
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
