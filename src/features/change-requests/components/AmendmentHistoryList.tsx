"use client";

import { useAmendments } from "../hooks/useAmendments";
import Spinner from "@/src/shared/components/Spinner";
import { formatCurrency } from "@/src/shared/lib/format";
import { useFormat } from "@/src/shared/hooks/useFormat";
import { useTranslations } from "next-intl";

interface AmendmentHistoryListProps {
  projectId: string;
}

// Read-only list of approved amendments — the original approved Contract and
// every amendment remain viewable per the sprint doc; this only surfaces the
// summary fields (amendment number, effective date, resulting value). Full
// previous/new terms JSON is available via useAmendment(id) if a detail view
// is opened later.
export function AmendmentHistoryList({ projectId }: AmendmentHistoryListProps) {
  const t = useTranslations("changeRequests.amendments");
  const format = useFormat();
  const { data: amendments, isLoading } = useAmendments(projectId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner size={20} />
      </div>
    );
  }

  if (!amendments || amendments.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="mb-2 font-semibold text-text-primary text-sm">{t("title")}</h3>
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        {amendments.map((amendment) => (
          <div
            key={amendment.id}
            className="flex justify-between items-center gap-3 p-4 border-border border-b last:border-b-0"
          >
            <div>
              <p className="font-medium text-text-primary text-sm">
                {t.rich("item", {
                  number: amendment.amendmentNumber,
                  title: amendment.changeRequestTitle,
                  bdi: (chunks) => <bdi>{chunks}</bdi>,
                })}
              </p>
              <p className="mt-0.5 text-text-secondary text-xs">
                {t("effective", { date: format.dateTime(amendment.effectiveDate) })}
              </p>
            </div>
            <p className="font-numbers font-semibold text-text-primary text-sm">
              {formatCurrency(amendment.resultingProjectValue)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
