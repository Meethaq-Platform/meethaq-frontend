"use client";

import { useQuery } from "@tanstack/react-query";
import { getInvitationById } from "../lib/service";

export function useInvitation(id: string) {
  return useQuery({
    queryKey: ["invitation", id],
    queryFn: async () => {
      const response = await getInvitationById(id);
      return response.data;
    },
    retry: 1,
  });
}
