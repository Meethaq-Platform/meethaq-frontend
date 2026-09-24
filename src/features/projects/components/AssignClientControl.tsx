"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { useClients } from "@/src/features/clients/hooks/useClients";
import { useDebouncedValue } from "@/src/features/clients/hooks/useDebouncedValue";
import { useAssignClient } from "../hooks/useAssignClient";
import { useUnassignClient } from "../hooks/useUnassignClient";
import Button from "@/src/shared/components/Button";
import ConfirmModal from "@/src/shared/components/ConfirmModal";
import InputError from "@/src/shared/components/InputError";

interface AssignClientControlProps {
  projectId: number;
  clientId: number | null;
  clientName: string | null;
}

export function AssignClientControl({
  projectId,
  clientId,
  clientName,
}: AssignClientControlProps) {
  const t = useTranslations("projects.assignClient");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isUnassignOpen, setIsUnassignOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebouncedValue(search, 400);
  const { data: clients, isLoading: isLoadingClients } = useClients({
    pageNumber: 1,
    pageSize: 20,
    search: debouncedSearch || undefined,
  });

  const assignClient = useAssignClient(String(projectId));
  const unassignClient = useUnassignClient(String(projectId));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: number, name: string) => {
    setSelected({ id, name });
    setSearch(name);
    setIsOpen(false);
  };

  const handleAssign = () => {
    if (!selected) return;
    assignClient.mutate(
      { relationshipId: selected.id },
      {
        onSuccess: () => {
          setSelected(null);
          setSearch("");
        },
      },
    );
  };

  if (clientId) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <span dir="auto" className="text-text-primary text-sm">{clientName}</span>

          <button
            type="button"
            onClick={() => setIsUnassignOpen(true)}
            className="flex items-center gap-1.5 hover:bg-danger-muted px-3 rounded-lg h-8 font-medium text-danger text-sm transition"
          >
            <X size={14} />
            {t("unassign")}
          </button>
        </div>

        <ConfirmModal
          open={isUnassignOpen}
          onClose={() => setIsUnassignOpen(false)}
          onConfirm={() =>
            unassignClient.mutate(undefined, {
              onSuccess: () => setIsUnassignOpen(false),
            })
          }
          title={t("confirmTitle")}
          description={
            clientName
              ? t.rich("confirmDescription", {
                  name: clientName,
                  bdi: (chunks) => <bdi>{chunks}</bdi>,
                })
              : t("confirmDescriptionNoName")
          }
          confirmLabel={t("confirm")}
          confirmingLabel={t("confirming")}
          variant="amber"
          isConfirming={unassignClient.isPending}
          errorMessage={
            unassignClient.isError
              ? unassignClient.error instanceof Error
                ? unassignClient.error.message
                : t("unassignFailed")
              : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div ref={containerRef} className="relative flex-1">
          <Search
            size={16}
            className="top-1/2 inset-s-3 absolute text-text-secondary -translate-y-1/2 pointer-events-none"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setSelected(null);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setIsOpen(false);
            }}
            placeholder={t("searchPlaceholder")}
            className="bg-surface py-2 pe-4 ps-9 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full h-10 text-text-primary placeholder:text-text-secondary text-sm transition"
          />

          {isOpen && (
            <div className="top-full z-10 absolute bg-surface shadow-lg mt-1 border border-border rounded-xl w-full max-h-60 overflow-auto">
              {isLoadingClients ? (
                <p className="flex items-center gap-2 px-3 py-2 text-text-secondary text-sm">
                  <Loader2 size={14} className="animate-spin" />
                  {t("searching")}
                </p>
              ) : clients?.items.length ? (
                clients.items.map((client) => (
                  <button
                    key={client.relationshipId}
                    type="button"
                    onClick={() =>
                      handleSelect(client.relationshipId, client.clientFullName)
                    }
                    className="block hover:bg-surface-muted focus-visible:bg-surface-muted px-3 py-2 outline-none w-full text-text-primary text-sm text-start transition"
                  >
                    {client.clientFullName}
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-text-secondary text-sm">
                  {t("noClients")}
                </p>
              )}
            </div>
          )}
        </div>

        <Button
          type="button"
          onClick={handleAssign}
          disabled={!selected}
          loading={assignClient.isPending}
          loadingText={t("assigning")}
          className="h-10 shrink-0"
        >
          {t("assign")}
        </Button>
      </div>

      {assignClient.isError && (
        <InputError
          message={
            assignClient.error instanceof Error
              ? assignClient.error.message
              : t("assignFailed")
          }
        />
      )}
    </div>
  );
}
