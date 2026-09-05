"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClient } from "../lib/service";
import type { ClientsListData, UpdateClientRequest } from "../types/client";

export function useUpdateClient(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-client"],
    mutationFn: (data: UpdateClientRequest) => updateClient(id, data),
    onSuccess: (response) => {
      const client = response.data;
      if (!client) return;

      queryClient.setQueryData(["client", id], client);

      queryClient.setQueriesData<ClientsListData>(
        { queryKey: ["clients"] },
        (current) =>
          current
            ? {
                ...current,
                items: current.items.map((item) =>
                  item.relationshipId === client.relationshipId ? client : item,
                ),
              }
            : current,
      );
    },
  });
}
