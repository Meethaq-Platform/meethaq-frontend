"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { useState } from "react";
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

  const body = (
    <div
      className={`relative flex flex-col gap-1.5 p-4 rounded-xl h-full ${
        tone ? toneBackground[tone] : "bg-surface-muted"
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <span className="text-text-secondary text-xs">{card.title}</span>

        {card.definitionTooltip && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              setShowTooltip((prev) => !prev);
            }}
            aria-label={`What does "${card.title}" mean?`}
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
        <span className="text-text-secondary text-xs">{humanizePeriod(card.period)}</span>
      )}

      {showTooltip && card.definitionTooltip && (
        <p className="bg-surface mt-1 p-2 border border-border rounded-lg text-text-secondary text-xs">
          {card.definitionTooltip}
        </p>
      )}
    </div>
  );

  if (card.drillDownNavigationUrl) {
    return (
      <Link href={card.drillDownNavigationUrl} className="block hover:opacity-90 transition">
        {body}
      </Link>
    );
  }

  return body;
}
