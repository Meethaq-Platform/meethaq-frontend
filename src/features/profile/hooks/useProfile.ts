"use client";

import { getProfile } from "../lib/service";
import { useQuery } from "@tanstack/react-query";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await getProfile();
      return response.data;
    },
    retry: 1,
  });
}
