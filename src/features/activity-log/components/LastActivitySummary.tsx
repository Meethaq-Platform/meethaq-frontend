"use client";

import { History } from "lucide-react";
import { useActivity } from "../hooks/useActivity";
import RelativeTime from "@/src/shared/components/RelativeTime";

interface LastActivitySummaryProps {
  projectId: string;
}

export function LastActivitySummary({ projectId }: LastActivitySummaryProps) {
  const { data: entries, isLoading } = useActivity(projectId);

  if (isLoading || !entries || entries.length === 0) {
    return null;
  }

  const latest = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];

  return (
    <div className="flex items-start gap-2 sm:gap-3 bg-surface-muted shadow-sm px-3 sm:px-4 py-2.5 sm:py-3 border border-border rounded-xl w-full sm:w-auto sm:max-w-sm text-start">
      <div className="flex justify-center items-center bg-primary-muted rounded-full w-8 sm:w-9 h-8 sm:h-9 text-primary shrink-0">
        <History size={15} className="sm:size-4" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-text-secondary text-xs uppercase tracking-wide">
          Last Activity
        </p>
        <p className="mt-0.5 text-text-primary text-xs sm:text-sm">
          {latest.description}
        </p>
        <p className="mt-1 text-text-secondary text-xs">
          {latest.performedByName} · <RelativeTime value={latest.createdAt} />
        </p>
      </div>
    </div>
  );
}
