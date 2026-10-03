"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useInvitations } from "../hooks/useInvitations";
import { InvitationsTable, InvitationsTableSkeleton } from "./InvitationsTable";
import ErrorState from "@/src/shared/components/ErrorState";

// Shared with ClientProjectsPage, whose tab dot reads the same first page.
export const INVITATIONS_PAGE_SIZE = 10;

export function InvitationsSection() {
  const t = useTranslations("clientProjects.invitations");
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isError, refetch } = useInvitations({
    pageNumber,
    pageSize: INVITATIONS_PAGE_SIZE,
  });

  if (isLoading) {
    return <InvitationsTableSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        message={t("loadFailed")}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <InvitationsTable
      invitations={data.items}
      pageNumber={data.pageNumber}
      totalPages={data.totalPages}
      totalCount={data.totalCount}
      onPageChange={setPageNumber}
    />
  );
}
