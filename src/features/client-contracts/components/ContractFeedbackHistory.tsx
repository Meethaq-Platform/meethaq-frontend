import { useTranslations } from "next-intl";
import { useContractFeedback } from "../hooks/useContractFeedback";
import { useFormat } from "@/src/shared/hooks/useFormat";

export function ContractFeedbackHistory({ projectId }: { projectId: string }) {
  const t = useTranslations("clientContracts.feedbackHistory");
  const format = useFormat();
  const { data } = useContractFeedback(projectId);

  if (!data || data.items.length === 0) return null;

  return (
    <div className="bg-surface p-6 border border-border rounded-2xl">
      <h2 className="mb-4 font-semibold text-text-primary text-base">
        {t("title")}
      </h2>

      <div className="space-y-4">
        {data.items.map((item) => (
          <div key={item.id} className="ps-4 border-border border-s-2">
            <p dir="auto" className="text-text-primary text-sm whitespace-pre-wrap">
              {item.feedback}
            </p>
            <p className="mt-1 text-text-secondary text-xs">
              <bdi>{item.requestedByClientName ?? t("you")}</bdi> — {format.date(item.requestedAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
