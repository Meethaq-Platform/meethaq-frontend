"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

import {
  DEFAULT_PROJECT_TAB,
  isProjectTab,
  type ProjectTab,
} from "../lib/project-tabs";

// The URL is the only source of truth, so links to ?tab=... work even while
// the page is already open. Switching uses history.replaceState, which Next
// syncs into useSearchParams without a server round trip (router.replace would
// re-render the dynamic route and flash its loading state), and replace rather
// than push keeps Back leaving the project instead of stepping through tabs.
export function useProjectTab() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("tab");
  const tab: ProjectTab = isProjectTab(requested) ? requested : DEFAULT_PROJECT_TAB;

  const setTab = useCallback((next: ProjectTab) => {
    const params = new URLSearchParams(window.location.search);
    if (next === DEFAULT_PROJECT_TAB) params.delete("tab");
    else params.set("tab", next);

    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`,
    );
  }, []);

  return [tab, setTab] as const;
}
