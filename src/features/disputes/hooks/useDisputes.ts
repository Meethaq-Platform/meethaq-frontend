"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getDisputes } from "../lib/service";

export function useDisputes(projectId: string) {
  return useInfiniteQuery({
    queryKey: ["disputes", projectId],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      const response = await getDisputes(projectId, pageParam);
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    retry: 1,
  });
}
