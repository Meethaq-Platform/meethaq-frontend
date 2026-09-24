"use client";

import { useCurrentUser } from "@/src/features/auth/hooks/useCurrentUser";
import { useContract } from "@/src/features/contracts/hooks/useContract";
import { useClientContract } from "@/src/features/client-contracts/hooks/useClientContract";

// Activity entries only carry a milestoneId; the title (used when the entry's
// text is rebuilt in another language) comes from the project's contract,
// which the project page has usually loaded already.
export function useMilestoneTitles(projectId: string, enabled: boolean) {
  const { data: user } = useCurrentUser();
  const role = user?.roles[0]?.toLowerCase();
  const freelancerContract = useContract(projectId, enabled && role === "freelancer");
  const clientContract = useClientContract(projectId, enabled && role === "client");
  const contract = role === "freelancer" ? freelancerContract.data : clientContract.data;

  return new Map((contract?.milestones ?? []).map((m) => [m.id, m.title]));
}
