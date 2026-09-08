"use client";

import { useQuery } from "@tanstack/react-query";
import { getInvitations } from "../lib/service";
import type { GetInvitationsParams } from "../types/client-project";

export function useInvitations(params: GetInvitationsParams) {
  return useQuery({
    queryKey: ["invitations", params],
    queryFn: async () => {
      const response = await getInvitations(params);
      return response.data;
    },
    retry: 1,
  });
}
