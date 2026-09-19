"use client";

import { useCallback, useState } from "react";

export function useCopyToClipboard(resetDelayMs = 1500) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        setTimeout(() => setCopiedText(null), resetDelayMs);
        return true;
      } catch {
        setCopiedText(null);
        return false;
      }
    },
    [resetDelayMs],
  );

  return { copy, copiedText };
}
