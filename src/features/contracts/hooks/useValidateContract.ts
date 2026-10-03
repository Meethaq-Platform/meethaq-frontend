"use client";

import { useMutation } from "@tanstack/react-query";
import { validateContract } from "../lib/service";

export function useValidateContract(projectId: string) {
  return useMutation({
    mutationKey: ["validate-contract"],
    mutationFn: () => validateContract(projectId),
    // A pre-flight check that runs when the submit modal opens, not an
    // action: its result and failures are shown inside the modal, and a
    // success toast here would read as "contract sent" before confirming.
    meta: { suppressToast: true },
  });
}
