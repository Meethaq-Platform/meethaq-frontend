"use client";

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useApiMessage } from "../hooks/useApiMessage";

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

// The QueryClient and its handlers are created once, but the language can
// change afterwards (router.refresh without a remount), so the provider keeps
// the fallback text and the message translator up to date from an effect.
let fallbackErrorMessage = "Something went wrong.";
let describeMessage: ReturnType<typeof useApiMessage> = (message) => ({ text: message });

export function QueryProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("common.states");
  const apiMessage = useApiMessage();
  useEffect(() => {
    fallbackErrorMessage = t("somethingWentWrong");
    describeMessage = apiMessage;
  }, [t, apiMessage]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onSuccess: (data, _variables, _context, mutation) => {
            if (mutation.meta?.suppressToast) return;
            if (!hasMessage(data)) return;
            const { text, detail } = describeMessage(data.message, "success");
            toast.success(text, detail ? { description: detail } : undefined);
          },
          onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.suppressToast) return;
            // The fallback is already in the active language.
            if (!(error instanceof Error)) return void toast.error(fallbackErrorMessage);
            const { text, detail } = describeMessage(error.message, "error");
            toast.error(text, detail ? { description: detail } : undefined);
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
