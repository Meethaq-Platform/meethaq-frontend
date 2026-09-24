"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTranslations } from "next-intl";

import { useDirection } from "@/src/i18n/useDirection";

import { useTheme } from "../hooks/useTheme";

export default function Toaster() {
  const { theme } = useTheme();
  const dir = useDirection();
  const t = useTranslations("common.toasts");

  return (
    <SonnerToaster
      theme={theme ?? "light"}
      dir={dir}
      position={dir === "rtl" ? "bottom-left" : "bottom-right"}
      containerAriaLabel={t("regionLabel")}
      richColors
      closeButton
    />
  );
}
