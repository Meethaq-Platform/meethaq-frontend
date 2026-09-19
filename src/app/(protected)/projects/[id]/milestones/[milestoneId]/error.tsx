"use client";

import { useEffect } from "react";

import ErrorState from "@/src/shared/components/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      message="Something went wrong while loading this milestone."
      onRetry={reset}
    />
  );
}
