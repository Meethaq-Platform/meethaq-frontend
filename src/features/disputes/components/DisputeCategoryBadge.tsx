import { useTranslations } from "next-intl";

import type { DisputeCategory } from "../types/dispute";
import { useStatusLabel } from "@/src/shared/hooks/useStatusLabel";

export function DisputeCategoryBadge({ category }: { category: DisputeCategory }) {
  const label = useStatusLabel("disputeCategory");
  const t = useTranslations("status");

  return (
    <span className="inline-flex items-center bg-surface-muted px-2.5 py-1 rounded-full font-medium text-text-secondary text-xs">
      {label(category, t("unknownCategory", { value: category }))}
    </span>
  );
}
