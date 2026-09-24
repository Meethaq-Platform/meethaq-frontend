"use client";

import { Toaster as SonnerToaster } from "sonner";

import { useTheme } from "../hooks/useTheme";

export default function Toaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      theme={theme ?? "light"}
      position="bottom-right"
      richColors
      closeButton
    />
  );
}
