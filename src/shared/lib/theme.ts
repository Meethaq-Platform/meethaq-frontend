export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

// Runs inline in <head> before first paint so a saved (or OS-preferred) dark
// theme never flashes light. Must stay dependency-free, plain ES5.
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})()`;

export function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function setTheme(theme: Theme) {
  // Crossfade the whole page via the View Transitions API; browsers without
  // it (or users who prefer reduced motion) get an instant switch.
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (document.startViewTransition && !reduceMotion) {
    document.startViewTransition(() => applyTheme(theme));
  } else {
    applyTheme(theme);
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage unavailable (private mode) — the choice lasts for this page only.
  }
}
