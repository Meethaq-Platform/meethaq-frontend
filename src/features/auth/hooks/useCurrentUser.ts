"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../lib/service";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await getCurrentUser();
      return response.data;
    },
  });
}
