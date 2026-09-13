"use client";

import { useMutation } from "@tanstack/react-query";
import { validateContract } from "../lib/service";

export function useValidateContract(projectId: string) {
  return useMutation({
    mutationKey: ["validate-contract"],
    mutationFn: () => validateContract(projectId),
  });
}
