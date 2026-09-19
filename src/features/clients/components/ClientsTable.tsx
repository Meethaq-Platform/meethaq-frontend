import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

import type { Client } from "../types/client";
import { ClientAvatar } from "./ClientAvatar";
import Pagination from "@/src/shared/components/Pagination";
import EmptyState from "@/src/shared/components/EmptyState";

interface ClientsTableProps {
  clients: Client[];
  isFiltering: boolean;
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function ClientsTable({
  clients,
  isFiltering,
  pageNumber,
  totalPages,
  totalCount,
  onPageChange,
}: ClientsTableProps) {
  if (clients.length === 0) {
    return isFiltering ? (
      <EmptyState
        icon={Users}
        title="No clients found"
        description="Try adjusting your search or filters."
      />
    ) : (
      <EmptyState
        icon={Users}
        title="No clients yet"
        description="Add your first client to start tracking projects together."
      />
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-primary-muted">
            <tr className="border-border border-b">
              <th className="px-6 py-3.5 font-medium text-primary text-xs text-left uppercase tracking-wide">
                Client
              </th>
              <th className="px-6 py-3.5 font-medium text-primary text-xs text-left uppercase tracking-wide">
                Email
              </th>
              <th className="px-6 py-3.5 font-medium text-primary text-xs text-left uppercase tracking-wide">
                Company
              </th>
              <th className="px-6 py-3.5 font-medium text-primary text-xs text-right uppercase tracking-wide">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {clients.map((client) => (
              <tr
                key={client.relationshipId}
                className="hover:bg-border/40 transition"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <ClientAvatar
                      fullName={client.clientFullName}
                      profileImage={client.clientProfileImage}
                    />
                    <span className="font-medium text-text-primary">
                      {client.clientFullName}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-text-secondary">
                  {client.clientEmail}
                </td>

                <td className="px-6 py-4 text-text-secondary">
                  {client.companyName ?? "—"}
                </td>

                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/clients/${client.relationshipId}`}
                    aria-label={`View ${client.clientFullName}'s details`}
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
        itemLabel="client"
      />
    </div>
  );
}
