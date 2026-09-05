"use client";

import { useQuery } from "@tanstack/react-query";
import type { Client } from "../types/client";

// There's no single-client endpoint yet, so the detail page can only show
// data already seen in a list fetch (seeded into the cache by useClients).
// `enabled: false` means this never fetches on its own — it just reactively
// reads whatever another query has already written to this key.
export function useCachedClient(id: string) {
  return useQuery<Client | undefined>({
    queryKey: ["client", id],
    queryFn: () => undefined,
    enabled: false,
    staleTime: Infinity,
  });
}
