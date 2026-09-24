"use client";

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
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

export function QueryProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("common.states");
  // The client is created once, but the language can change afterwards
  // (router.refresh without a remount), so the handler reads the latest
  // fallback text through a ref.
  const fallbackErrorRef = useRef(t("somethingWentWrong"));
  useEffect(() => {
    fallbackErrorRef.current = t("somethingWentWrong");
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
            toast.error(getErrorMessage(error, fallbackErrorRef.current));
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
