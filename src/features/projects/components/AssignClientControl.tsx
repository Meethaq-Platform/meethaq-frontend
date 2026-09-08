"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { useClients } from "@/src/features/clients/hooks/useClients";
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
  const [selectedId, setSelectedId] = useState("");
  const [isUnassignOpen, setIsUnassignOpen] = useState(false);
  const { data: clients, isLoading: isLoadingClients } = useClients({
    pageNumber: 1,
    pageSize: 50,
  });

  const assignClient = useAssignClient(String(projectId));
  const unassignClient = useUnassignClient(String(projectId));

  const handleAssign = () => {
    if (!selectedId) return;
    assignClient.mutate(
      { relationshipId: Number(selectedId) },
      { onSuccess: () => setSelectedId("") },
    );
  };

  if (clientId) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <span className="text-text-primary text-sm">{clientName}</span>

          <button
            type="button"
            onClick={() => setIsUnassignOpen(true)}
            className="flex items-center gap-1.5 hover:bg-danger-muted px-3 rounded-lg h-8 font-medium text-danger text-sm transition"
          >
            <X size={14} />
            Unassign
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
          title="Unassign this client?"
          description={`${clientName ?? "This client"} will no longer be linked to this project. You can reassign a client at any time.`}
          confirmLabel="Yes, unassign"
          confirmingLabel="Unassigning..."
          variant="amber"
          isConfirming={unassignClient.isPending}
          errorMessage={
            unassignClient.isError
              ? unassignClient.error instanceof Error
                ? unassignClient.error.message
                : "Failed to unassign client."
              : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <select
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
          disabled={isLoadingClients}
          className="bg-surface px-3 border border-border focus:border-primary rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full h-10 text-text-primary text-sm transition"
        >
          <option value="">
            {isLoadingClients ? "Loading clients..." : "Select a client"}
          </option>
          {clients?.items.map((client) => (
            <option key={client.relationshipId} value={client.relationshipId}>
              {client.clientFullName}
            </option>
          ))}
        </select>

        <Button
          type="button"
          onClick={handleAssign}
          disabled={!selectedId}
          loading={assignClient.isPending}
          loadingText="Assigning..."
          className="h-10 shrink-0"
        >
          Assign
        </Button>
      </div>

      {assignClient.isError && (
        <InputError
          message={
            assignClient.error instanceof Error
              ? assignClient.error.message
              : "Failed to assign client."
          }
        />
      )}
    </div>
  );
}
