"use client";

import { Moon, Sun } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";

import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle({
  className,
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const t = useTranslations("common.theme");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      title={isDark ? t("light") : t("dark")}
      className={twMerge(
        "hover:bg-surface-muted p-2 rounded-lg text-text-secondary hover:text-text-primary transition",
        className
      )}
    >
      {/* Theme is unknown until hydration; keep the slot sized meanwhile. */}
      {theme === null ? (
        <span className="block w-5 h-5 shrink-0" />
      ) : isDark ? (
        <Sun size={20} className="shrink-0" />
      ) : (
        <Moon size={20} className="shrink-0" />
      )}
      {showLabel && theme !== null && (
        <span>{isDark ? t("light") : t("dark")}</span>
      )}
    </button>
  );
}
