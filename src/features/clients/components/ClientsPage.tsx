"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useClients } from "../hooks/useClients";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { ClientsToolbar } from "./ClientsToolbar";
import { ClientsTable } from "./ClientsTable";
import Spinner from "@/src/shared/components/Spinner";
import ErrorState from "@/src/shared/components/ErrorState";

const PAGE_SIZE = 10;

export default function ClientsPage() {
  const t = useTranslations("clients.list");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name_asc");
  const [pageNumber, setPageNumber] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading, isError, refetch } = useClients({
    pageNumber,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
    sortBy: sort,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPageNumber(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPageNumber(1);
  };

  return (
    <>
      <ClientsToolbar
        search={search}
        onSearchChange={handleSearchChange}
        sort={sort}
        onSortChange={handleSortChange}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner size={28} />
        </div>
      ) : isError || !data ? (
        <ErrorState
          message={t("loadFailed")}
          onRetry={() => refetch()}
        />
      ) : (
        <ClientsTable
          clients={data.items}
          isFiltering={debouncedSearch.length > 0}
          pageNumber={data.pageNumber}
          totalPages={data.totalPages}
          totalCount={data.totalCount}
          onPageChange={setPageNumber}
        />
      )}
    </>
  );
}
