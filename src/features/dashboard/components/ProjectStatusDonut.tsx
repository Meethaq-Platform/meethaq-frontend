"use client";

import Link from "next/link";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface DonutSegment {
  key: string;
  label: string;
  value: number;
  color: string;
  href?: string;
}

interface ProjectStatusDonutProps {
  segments: DonutSegment[];
  total: number;
  totalLabel: string;
  totalHref?: string;
}

interface SliceTooltipProps {
  active?: boolean;
  payload?: { payload: DonutSegment }[];
}

function SliceTooltip({ active, payload }: SliceTooltipProps) {
  if (!active || !payload?.length) return null;
  const segment = payload[0].payload;

  return (
    <div className="bg-surface shadow-lg px-3 py-2 border border-border rounded-lg text-xs">
      <p className="font-semibold text-text-primary">{segment.value}</p>
      <p className="text-text-secondary">{segment.label}</p>
    </div>
  );
}

// A compact status breakdown: a gapped, rounded-corner donut (paddingAngle +
// cornerRadius) with the total in the center and a small legend as the
// "small info" beside it — reuses the app's existing status tokens
// (success/info/danger/neutral) for the slices rather than a separate
// categorical palette, so a color here means the same thing it does on
// every ProjectStatusBadge elsewhere in the app.
export default function ProjectStatusDonut({
  segments,
  total,
  totalLabel,
  totalHref,
}: ProjectStatusDonutProps) {
  const visibleSegments = segments.filter((segment) => segment.value > 0);

  const totalBlock = (
    <div className="text-center">
      <p className="font-bold text-text-primary text-2xl">{total}</p>
      <p className="text-text-secondary text-xs">{totalLabel}</p>
    </div>
  );

  return (
    <div className="flex sm:flex-row flex-col items-center gap-4">
      <div className="relative w-36 h-36 shrink-0">
        {visibleSegments.length === 0 ? (
          <div className="flex justify-center items-center bg-surface-muted rounded-full w-full h-full">
            {totalBlock}
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visibleSegments}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={44}
                  outerRadius={64}
                  paddingAngle={visibleSegments.length > 1 ? 4 : 0}
                  cornerRadius={6}
                  stroke="none"
                >
                  {visibleSegments.map((segment) => (
                    <Cell key={segment.key} fill={segment.color} />
                  ))}
                </Pie>
                <Tooltip content={<SliceTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              {totalHref ? (
                <Link href={totalHref} className="pointer-events-auto hover:opacity-80 transition">
                  {totalBlock}
                </Link>
              ) : (
                totalBlock
              )}
            </div>
          </>
        )}
      </div>

      <ul className="flex-1 gap-x-4 gap-y-1.5 grid grid-cols-2 w-full min-w-0">
        {segments.map((segment) => {
          const row = (
            <span className="flex items-center gap-1.5 min-w-0">
              <span
                className="rounded-full w-2 h-2 shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-text-secondary text-xs truncate">{segment.label}</span>
              <span className="ms-auto font-semibold text-text-primary text-xs">{segment.value}</span>
            </span>
          );

          return (
            <li key={segment.key}>
              {segment.href ? (
                <Link href={segment.href} className="block hover:opacity-80 transition">
                  {row}
                </Link>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
