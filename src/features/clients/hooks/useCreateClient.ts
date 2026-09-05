"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../lib/service";
import type { ClientsListData } from "../types/client";

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-client"],
    mutationFn: createClient,
    onSuccess: (response) => {
      queryClient.setQueryData(
        ["client", String(response.data.relationshipId)],
        response.data,
      );

      queryClient.setQueriesData<ClientsListData>(
        { queryKey: ["clients"] },
        (current) =>
          current
            ? {
                ...current,
                items: [response.data, ...current.items],
                totalCount: current.totalCount + 1,
              }
            : current,
      );
    },
  });
}
