"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../lib/service";
import type { Client, ClientsListData } from "../types/client";

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-client"],
    mutationFn: createClient,
    onSuccess: (response) => {
      // The create response is narrower than Client (no phone/image/country
      // yet) — fill in what we know is still unset for a brand-new relationship.
      const client: Client = {
        ...response.data,
        clientPhoneNumber: null,
        clientProfileImage: null,
        clientCountry: null,
        updatedAt: response.data.dateAdded,
      };

      queryClient.setQueryData(["client", String(client.relationshipId)], client);

      queryClient.setQueriesData<ClientsListData>(
        { queryKey: ["clients"] },
        (current) =>
          current
            ? {
                ...current,
                items: [client, ...current.items],
                totalCount: current.totalCount + 1,
              }
            : current,
      );
    },
  });
}
