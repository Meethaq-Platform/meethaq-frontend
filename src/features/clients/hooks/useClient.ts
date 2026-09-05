"use client";

import { useQuery } from "@tanstack/react-query";
import { getClientById } from "../lib/service";

export function useClient(id: string) {
  return useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const response = await getClientById(id);
      return response.data;
    },
    retry: 1,
  });
}
