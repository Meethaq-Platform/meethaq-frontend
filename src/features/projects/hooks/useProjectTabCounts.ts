"use client";

import { useChangeRequests } from "@/src/features/change-requests/hooks/useChangeRequests";
import { useDisputes } from "@/src/features/disputes/hooks/useDisputes";
import { usePaymentsSummary } from "@/src/features/payments/hooks/usePaymentsSummary";
import type { ProjectTab } from "../lib/project-tabs";

type CursorPage = { items: unknown[]; hasMore: boolean } | null | undefined;

// Change requests and disputes are cursor-paginated with no total, so the
// count is what the first page holds, with a "+" when more pages exist.
function cursorCount(firstPage: CursorPage): string | undefined {
  if (!firstPage) return undefined;
  const count = firstPage.items.length;
  return firstPage.hasMore ? `${count}+` : String(count);
}

// Item counts shown on the project tabs. Uses the same queries the tabs do,
// so opening a tab afterwards is a cache hit. Milestones come from the
// caller, since the freelancer and client read them from different contract
// endpoints. Zero or unknown counts are left out.
export function useProjectTabCounts(
  projectId: string,
  milestoneCount: number | undefined,
): Partial<Record<ProjectTab, string>> {
  const payments = usePaymentsSummary(projectId);
  const changeRequests = useChangeRequests(projectId);
  const disputes = useDisputes(projectId);

  const counts: Partial<Record<ProjectTab, string | undefined>> = {
    milestones: milestoneCount != null ? String(milestoneCount) : undefined,
    payments: payments.data ? String(payments.data.milestones.length) : undefined,
    changes: cursorCount(changeRequests.data?.pages[0]),
    disputes: cursorCount(disputes.data?.pages[0]),
  };

  return Object.fromEntries(
    Object.entries(counts).filter(([, value]) => value && value !== "0"),
  ) as Partial<Record<ProjectTab, string>>;
}
