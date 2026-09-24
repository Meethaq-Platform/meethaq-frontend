import { MessageSquareWarning } from "lucide-react";
import { useTranslations } from "next-intl";

export function ContractFeedbackBanner({ feedback }: { feedback: string }) {
  const t = useTranslations("contracts.feedback");

  return (
    <div className="flex items-start gap-3 bg-danger-muted p-4 border border-danger/20 rounded-2xl">
      <MessageSquareWarning size={18} className="text-danger shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-danger text-sm">
          {t("title")}
        </p>
        <p dir="auto" className="mt-1 text-text-primary text-sm whitespace-pre-wrap">
          {feedback}
        </p>
      </div>
    </div>
  );
}
