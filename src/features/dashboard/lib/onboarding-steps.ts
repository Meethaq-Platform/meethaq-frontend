import type { FreelancerFirstUse } from "../types/dashboard";

export interface OnboardingStep {
  done: boolean;
  key: "addClient" | "createProject" | "prepareContract" | "sendForApproval";
  href: string;
}

// Completed steps reflect actual records (the backend's own step*_ flags),
// not local/optimistic state. There's no per-step navigation URL in
// FreelancerFirstUseDto, so each step links to the existing workflow screen
// it belongs to (Clients / Projects) rather than a step-specific route that
// doesn't exist yet.
export function getOnboardingSteps(firstUse: FreelancerFirstUse): OnboardingStep[] {
  return [
    { done: firstUse.step1_ClientAdded, key: "addClient", href: "/clients" },
    { done: firstUse.step2_ProjectCreated, key: "createProject", href: "/projects" },
    { done: firstUse.step3_ContractPrepared, key: "prepareContract", href: "/projects" },
    { done: firstUse.step4_ContractSentForApproval, key: "sendForApproval", href: "/projects" },
  ];
}
