"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";

import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  setTheme,
  type Theme,
} from "../lib/theme";

// The <html> class is the source of truth (the init script sets it before
// React loads), so the hook just observes it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// Unknown on the server; consumers render a neutral state until hydration.
function getServerSnapshot(): Theme | null {
  return null;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    theme,
    setTheme,
    toggleTheme: () => setTheme(getSnapshot() === "dark" ? "light" : "dark"),
  };
}

// Mounted once at the root. Re-applies the theme after React's dev-mode
// remount wipes the class the init script set on <html>, and follows OS
// changes for users who never picked a theme explicitly.
export function useThemeSync() {
  useLayoutEffect(() => {
    applyTheme(getStoredTheme() ?? getSystemTheme());

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (!getStoredTheme()) applyTheme(getSystemTheme());
    };
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);
}
