"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import ErrorState from "@/src/shared/components/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common.states");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      message={t("loadMilestoneFailed")}
      onRetry={reset}
    />
  );
}
