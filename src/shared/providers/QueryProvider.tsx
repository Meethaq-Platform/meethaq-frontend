"use client";

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
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

// Fallback text for the global error toast. The QueryClient and its handlers
// are created once, but the language can change afterwards (router.refresh
// without a remount), so the provider keeps this up to date from an effect.
let fallbackErrorMessage = "Something went wrong.";

export function QueryProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("common.states");
  useEffect(() => {
    fallbackErrorMessage = t("somethingWentWrong");
  }, [t]);

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
            toast.error(getErrorMessage(error, fallbackErrorMessage));
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
