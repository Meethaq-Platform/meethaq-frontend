"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getClients } from "../lib/service";
import type { GetClientsParams } from "../types/client";

export function useClients(params: GetClientsParams) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["clients", params],
    queryFn: async () => {
      const response = await getClients(params);

      response.data?.items.forEach((client) => {
        queryClient.setQueryData(
          ["client", String(client.relationshipId)],
          client,
        );
      });

      return response.data;
    },
    retry: 1,
  });
}
