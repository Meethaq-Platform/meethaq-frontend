"use client";

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "../lib/getErrorMessage";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      // Auth mutations (login/register) already surface errors inline next
      // to the form and don't need a toast on top of that.
      suppressToast?: boolean;
    };
  }
}

function hasMessage(data: unknown): data is { message: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as { message?: unknown }).message === "string"
  );
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onSuccess: (data, _variables, _context, mutation) => {
            if (mutation.meta?.suppressToast) return;
            if (hasMessage(data)) toast.success(data.message);
          },
          onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.suppressToast) return;
            toast.error(getErrorMessage(error, "Something went wrong."));
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
