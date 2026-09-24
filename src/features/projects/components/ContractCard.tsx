import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import type { Project } from "../types/project";
import { ContractStatusBadge } from "@/src/features/contracts/components/ContractStatusBadge";
import Button from "@/src/shared/components/Button";

const summaryByStatus: Record<string, string> = {
  Draft: "Draft in progress — finish it and submit for approval.",
  PendingApproval: "Submitted — awaiting the client's approval.",
  ChangesRequested: "The client requested changes to this contract.",
  Approved: "Approved and locked in.",
};

// The "no contract" empty state intentionally doesn't reuse the shared
// EmptyState component here — EmptyState draws its own card chrome
// (border/bg/rounded), which would double up with this card's own wrapper.
export function ContractCard({ project }: { project: Project }) {
  const isEligible = Boolean(project.clientId) && project.totalValue != null;

  return (
    <div className="bg-surface p-6 border border-border rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-text-secondary text-xs uppercase tracking-wide">
          Contract
        </p>
        {project.contractStatus !== "None" && (
          <ContractStatusBadge status={project.contractStatus} />
        )}
      </div>

      {project.contractStatus === "None" ? (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <div className="flex justify-center items-center bg-surface-muted mb-1 rounded-full w-12 h-12 text-text-secondary">
            <FileText size={20} />
          </div>
          <p className="font-semibold text-text-primary text-sm">No contract yet</p>
          <p className="max-w-xs text-text-secondary text-sm">
            {isEligible
              ? "Draft a contract to define scope, milestones, and terms."
              : "Assign a client and set a project value to get started."}
          </p>
          <Link href={`/projects/${project.id}/contract`} className="mt-2">
            <Button type="button" className="h-9">
              Create Contract
            </Button>
          </Link>
        </div>
      ) : (
        <Link
          href={`/projects/${project.id}/contract`}
          className="flex justify-between items-center gap-3 hover:bg-surface-muted -m-2 p-2 rounded-xl transition"
        >
          <p className="text-text-secondary text-sm">
            {summaryByStatus[project.contractStatus] ?? "Manage this contract."}
          </p>
          <span className="flex items-center gap-1.5 font-semibold text-primary text-sm whitespace-nowrap shrink-0">
            {project.contractStatus === "Approved" ? "View Contract" : "Manage Contract"}
            <ArrowRight size={16} className="rtl-flip" />
          </span>
        </Link>
      )}
    </div>
  );
}
