"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/src/shared/lib/format";
import type { FinancialMetricCard } from "../types/dashboard";

export type FinancialCardTone = "primary" | "info" | "amber" | "success";

interface FinancialMetricCardViewProps {
  card: FinancialMetricCard;
  tone?: FinancialCardTone;
}

const toneBackground: Record<FinancialCardTone, string> = {
  primary: "bg-primary-muted",
  info: "bg-info-muted",
  amber: "bg-accent-value-muted",
  success: "bg-success-muted",
};

// The backend sends `period` as an unspaced PascalCase token ("AllTime",
// "CurrentOutstanding") rather than display text — spacing it out is purely
// cosmetic, not a guess at its meaning.
function humanizePeriod(period: string): string {
  return period.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

// Feature 23: every financial card carries its own period + a definition
// tooltip from the backend, so a user is never left guessing whether a
// figure is "All Time" or "This Month", or how two overlapping cards relate.
export default function FinancialMetricCardView({
  card,
  tone,
}: FinancialMetricCardViewProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const t = useTranslations("dashboard.metric");

  // Known period tokens are translated; unknown ones fall back to the
  // spaced-out token, as before.
  const periodLabel = (period: string) => {
    const key = `periods.${period}` as "periods.AllTime";
    return t.has(key) ? t(key) : humanizePeriod(period);
  };

  // Not a link: the backend's drillDownNavigationUrl points at flat
  // cross-project pages (/payments, /contracts, /milestones) that don't
  // exist in this app — every route here is nested under /projects/[id].
  // Rather than 404, these cards stay informational; the tooltip below
  // still explains what the figure means.
  return (
    <div
      className={`relative flex flex-col gap-1.5 p-4 rounded-xl h-full ${
        tone ? toneBackground[tone] : "bg-surface-muted"
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <span dir="auto" className="text-text-secondary text-xs">{card.title}</span>

        {card.definitionTooltip && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              setShowTooltip((prev) => !prev);
            }}
            aria-label={t("help", { title: card.title ?? "" })}
            className="text-text-secondary hover:text-text-primary shrink-0"
          >
            <Info size={13} />
          </button>
        )}
      </div>

      <span className="font-semibold text-text-primary text-lg sm:text-xl">
        {formatCurrency(card.amount, card.currency ?? "USD")}
      </span>

      {card.period && (
        <span className="text-text-secondary text-xs">{periodLabel(card.period)}</span>
      )}

      {showTooltip && card.definitionTooltip && (
        <p dir="auto" className="bg-surface mt-1 p-2 border border-border rounded-lg text-text-secondary text-xs">
          {card.definitionTooltip}
        </p>
      )}
    </div>
  );
}
