import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import type { ProjectInvitation } from "../types/client-project";
import { ProjectStatusBadge } from "@/src/features/projects/components/ProjectStatusBadge";
import Pagination from "@/src/shared/components/Pagination";
import EmptyState from "@/src/shared/components/EmptyState";

interface InvitationsTableProps {
  invitations: ProjectInvitation[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function InvitationsTable({
  invitations,
  pageNumber,
  totalPages,
  totalCount,
  onPageChange,
}: InvitationsTableProps) {
  if (invitations.length === 0) {
    return (
      <EmptyState
        icon={Mail}
        title="No pending invitations"
        description="Project invitations from freelancers will show up here."
      />
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b">
              <th className="px-6 py-3.5 font-medium text-text-secondary text-xs text-start uppercase tracking-wide">
                Title
              </th>
              <th className="px-6 py-3.5 font-medium text-text-secondary text-xs text-start uppercase tracking-wide">
                Freelancer
              </th>
              <th className="px-6 py-3.5 font-medium text-text-secondary text-xs text-start uppercase tracking-wide">
                Status
              </th>
              <th className="relative px-6 py-3.5 font-medium text-text-secondary text-xs text-end uppercase tracking-wide">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {invitations.map((invitation) => (
              <tr
                key={invitation.id}
                className="hover:bg-surface-muted transition"
              >
                <td className="px-6 py-4 font-medium text-text-primary">
                  {invitation.title}
                </td>

                <td className="px-6 py-4 text-text-secondary">
                  {invitation.freelancerName}
                </td>

                <td className="px-6 py-4">
                  <ProjectStatusBadge status={invitation.status} />
                </td>

                <td className="px-6 py-4 text-end">
                  <Link
                    href={`/projects/invitations/${invitation.id}`}
                    aria-label={`View invitation for ${invitation.title}`}
                    className="inline-flex justify-center items-center hover:bg-surface p-2 rounded-lg text-text-secondary hover:text-primary transition"
                  >
                    <ArrowRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={onPageChange}
        itemLabel="invitation"
      />
    </div>
  );
}
