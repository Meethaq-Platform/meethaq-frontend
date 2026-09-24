"use client";

import { Moon, Sun } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={twMerge(
        "hover:bg-surface-muted p-2 rounded-lg text-text-secondary hover:text-text-primary transition",
        className
      )}
    >
      {/* Theme is unknown until hydration; keep the slot sized meanwhile. */}
      {theme === null ? (
        <span className="block w-5 h-5" />
      ) : isDark ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
}
