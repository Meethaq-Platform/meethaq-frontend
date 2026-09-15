"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptInvitation } from "../lib/service";

// The acceptance response is a narrow DTO (no description/clientId/etc.), so
// there isn't enough to hand-patch the invitations/projects list caches —
// invalidate them instead and let the next read refetch the full shape.
export function useAcceptInvitation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["accept-invitation"],
    mutationFn: () => acceptInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["invitation", id] });
      queryClient.invalidateQueries({ queryKey: ["client-projects"] });
    },
  });
}
