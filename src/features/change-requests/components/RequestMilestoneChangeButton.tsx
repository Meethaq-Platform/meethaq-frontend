"use client";

import { useChangeRequests } from "../hooks/useChangeRequests";
import { CreateChangeRequestModal } from "./CreateChangeRequestModal";

interface RequestMilestoneChangeButtonProps {
  projectId: string;
  milestoneId: number;
}

// "Request Change" on a milestone's detail page: the same modal as the Change
// Requests tab, locked to this milestone. Hidden under the same MVP rule as
// the tab — only one pending change request per project at a time.
export function RequestMilestoneChangeButton({
  projectId,
  milestoneId,
}: RequestMilestoneChangeButtonProps) {
  const { data, isLoading } = useChangeRequests(projectId);
  const items = data?.pages.flatMap((page) => page?.items ?? []) ?? [];
  const hasPending = items.some((item) => item.status === 1);

  if (isLoading || hasPending) return null;

  return <CreateChangeRequestModal projectId={projectId} milestoneId={milestoneId} />;
}
