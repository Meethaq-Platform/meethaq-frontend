import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

// A placeholder block for content that is still loading. Size it like the
// content it stands in for (text line height, avatar size...) so nothing
// shifts when the real content arrives. The border color at 60% reads on both
// surface and surface-muted backgrounds, in light and dark themes.
export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={twMerge("bg-border/60 rounded-md motion-safe:animate-pulse", className)}
    />
  );
}

// Wraps a group of skeletons so assistive tech announces one "Loading"
// instead of reading nothing (every Skeleton is aria-hidden).
export function SkeletonRegion({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const t = useTranslations("common.states");

  return (
    <div role="status" className={className}>
      <span className="sr-only">{t("loading")}</span>
      {children}
    </div>
  );
}

// Card with a heading and a grid of value/label stats — the shape of the
// project's execution overview and payment summary cards.
export function StatsCardSkeleton({
  count,
  gridClassName,
}: {
  count: number;
  /** The loaded card's grid classes, so both lay out identically. */
  gridClassName: string;
}) {
  return (
    <SkeletonRegion className="bg-surface p-6 border border-border rounded-2xl">
      <Skeleton className="mb-4 w-40 h-5" />
      <div className={twMerge("gap-4 grid", gridClassName)}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="w-16 h-6" />
            <Skeleton className="w-20 h-3" />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}
