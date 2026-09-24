"use client";

import { useId, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Tabs from "@/src/shared/components/Tabs";
import { formatCurrency } from "@/src/shared/lib/format";
import { useFormat } from "@/src/shared/hooks/useFormat";
import { useLocale, useTranslations } from "next-intl";
import { useDirection } from "@/src/i18n/useDirection";
import type { FinancialTrend } from "../types/dashboard";
import type { TrendPeriod } from "../types/dashboard";

interface IncomeTrendChartProps {
  trend: FinancialTrend;
  period: TrendPeriod;
  onPeriodChange: (period: TrendPeriod) => void;
  title: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: { periodLabel: string; confirmedAmount: number } }[];
  currency: string;
}

function CustomTooltip({ active, payload, currency }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="bg-surface shadow-lg px-3 py-2 border border-border rounded-lg text-xs">
      <p className="text-text-secondary">{point.periodLabel}</p>
      <p className="font-semibold text-text-primary text-sm">
        {formatCurrency(point.confirmedAmount, currency)}
      </p>
    </div>
  );
}

// Feature 6 / 13: a single-series (one hue, the app's own --color-primary
// token) monthly bar chart — a single series needs no legend box per the
// dataviz guidance, the section title already names what's plotted. A table
// view is always available as the accessible/non-chart alternative, and
// months with zero confirmed income are included rather than skipped.
export default function IncomeTrendChart({
  trend,
  period,
  onPeriodChange,
  title,
}: IncomeTrendChartProps) {
  const [showTable, setShowTable] = useState(false);
  const isRtl = useDirection() === "rtl";
  const tableId = useId();
  const currency = trend.currency ?? "USD";
  const t = useTranslations("dashboard.trend");
  const locale = useLocale();
  const format = useFormat();
  // The API's periodLabel is English ("Apr 2026"); Arabic builds its own from
  // the numeric year/month so month names and digits follow the language.
  const points =
    locale === "ar"
      ? (trend.points ?? []).map((point) => ({
          ...point,
          periodLabel: format.monthYear(point.year, point.month),
        }))
      : (trend.points ?? []);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div>
          <p className="text-text-secondary text-xs">{title}</p>
          <p className="font-semibold text-text-primary text-lg">
            {formatCurrency(trend.totalAmount, currency)}
            <span className="ms-1.5 font-normal text-text-secondary text-xs">
              {t("totalOver", { months: trend.periodMonths })}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Tabs
            value={String(period) as "6" | "12"}
            onChange={(value) => onPeriodChange(Number(value) as TrendPeriod)}
            options={[
              { value: "6", label: t("months6") },
              { value: "12", label: t("months12") },
            ]}
          />
          <button
            type="button"
            onClick={() => setShowTable((prev) => !prev)}
            aria-pressed={showTable}
            aria-controls={tableId}
            className="hover:bg-surface-muted px-3 border border-border rounded-lg h-9 font-medium text-text-secondary text-xs transition"
          >
            {showTable ? t("viewChart") : t("viewTable")}
          </button>
        </div>
      </div>

      {showTable ? (
        <div id={tableId} className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b text-text-secondary text-xs">
                <th className="py-2 font-medium text-start">{t("month")}</th>
                <th className="py-2 font-medium text-end">{t("confirmedIncome")}</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr key={point.periodLabel} className="border-border/60 border-b last:border-0">
                  <td className="py-2 text-text-primary">{point.periodLabel}</td>
                  <td className="py-2 font-medium text-text-primary text-end tabular-nums">
                    {formatCurrency(point.confirmedAmount, point.currency ?? currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div id={tableId} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={points}
              // Months run right-to-left in RTL, with the value axis on the right.
              margin={isRtl ? { top: 4, right: 0, left: 4, bottom: 0 } : { top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis
                dataKey="periodLabel"
                reversed={isRtl}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
              />
              <YAxis
                orientation={isRtl ? "right" : "left"}
                tickLine={false}
                axisLine={false}
                width={48}
                tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
                tickFormatter={(value: number) => format.compact(value)}
              />
              <Tooltip
                cursor={{ fill: "var(--color-surface-muted)" }}
                content={<CustomTooltip currency={currency} />}
              />
              <Bar
                dataKey="confirmedAmount"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
