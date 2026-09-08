"use client";

import { useState } from "react";

import { useInvitations } from "../hooks/useInvitations";
import { InvitationsTable } from "./InvitationsTable";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";

const PAGE_SIZE = 10;

export function InvitationsSection() {
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isError, refetch } = useInvitations({
    pageNumber,
    pageSize: PAGE_SIZE,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size={28} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <ErrorState
        message="Failed to load your invitations."
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
