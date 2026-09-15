"use client";

import { useQuery } from "@tanstack/react-query";
import { getClientProjectById } from "../lib/service";

export function useClientProject(id: string) {
  return useQuery({
    queryKey: ["client-project", id],
    queryFn: async () => {
      const response = await getClientProjectById(id);
      return response.data;
    },
    retry: 1,
  });
}
