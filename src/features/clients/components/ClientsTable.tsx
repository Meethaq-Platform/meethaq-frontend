import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Client } from "../types/client";
import { ClientAvatar } from "./ClientAvatar";
import Pagination from "@/src/shared/components/Pagination";
import EmptyState from "@/src/shared/components/EmptyState";
import LinkRow from "@/src/shared/components/LinkRow";
import TableSkeleton from "@/src/shared/components/TableSkeleton";

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
  const t = useTranslations("clients.list");

  if (clients.length === 0) {
    return isFiltering ? (
      <EmptyState
        icon={Users}
        title={t("noResultsTitle")}
        description={t("noResultsDescription")}
      />
    ) : (
      <EmptyState
        icon={Users}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
      />
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-primary-muted">
            <tr className="border-border border-b">
              <th className="px-6 py-3.5 font-medium text-primary text-xs text-start uppercase tracking-wide">
                {t("columns.client")}
              </th>
              <th className="px-6 py-3.5 font-medium text-primary text-xs text-start uppercase tracking-wide">
                {t("columns.email")}
              </th>
              <th className="px-6 py-3.5 font-medium text-primary text-xs text-start uppercase tracking-wide">
                {t("columns.company")}
              </th>
              <th className="relative px-6 py-3.5 font-medium text-primary text-xs text-end uppercase tracking-wide">
                <span className="sr-only">{t("columns.actions")}</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {clients.map((client) => (
              <LinkRow
                key={client.relationshipId}
                href={`/clients/${client.relationshipId}`}
                className="hover:bg-border/40 transition"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <ClientAvatar
                      fullName={client.clientFullName}
                      profileImage={client.clientProfileImage}
                    />
                    <span dir="auto" className="font-medium text-text-primary">
                      {client.clientFullName}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-text-secondary">
                  <span dir="ltr">{client.clientEmail}</span>
                </td>

                <td dir="auto" className="px-6 py-4 text-text-secondary">
                  {client.companyName ?? "—"}
                </td>

                <td className="px-6 py-4 text-end">
                  <Link
                    href={`/clients/${client.relationshipId}`}
                    aria-label={t("viewDetails", { name: client.clientFullName })}
                    className="inline-flex justify-center items-center hover:bg-surface p-2 rounded-lg text-text-secondary hover:text-primary transition"
                  >
                    <ArrowRight size={16} className="rtl-flip" />
                  </Link>
                </td>
              </LinkRow>
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

export function ClientsTableSkeleton() {
  const t = useTranslations("clients.list");

  return (
    <TableSkeleton
      columns={[
        { label: t("columns.client"), shape: "avatar" },
        { label: t("columns.email"), width: "w-44" },
        { label: t("columns.company"), width: "w-28" },
        { label: t("columns.actions"), srOnlyLabel: true, shape: "action", align: "end" },
      ]}
    />
  );
}
