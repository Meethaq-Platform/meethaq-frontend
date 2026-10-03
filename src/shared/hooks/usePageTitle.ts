"use client";

import { useEffect } from "react";

// Sets the browser tab title to reflect where the user actually is (e.g.
// "Projects/Company Website") instead of the static brand-name default.
// Static section titles are set via each page's own `metadata` export
// instead — this hook is only for titles that depend on client-fetched data
// (a project/client/milestone name), which isn't known until after render.
//
// Setting document.title once isn't enough: these routes have no metadata of
// their own, so Next applies the inherited title too, and when the data is
// already cached that lands after this effect and silently wins. The title
// is therefore re-applied whenever something else changes it while the page
// is mounted.
export function usePageTitle(title: string | null | undefined) {
  useEffect(() => {
    if (!title) return;

    const apply = () => {
      if (document.title !== title) document.title = title;
    };
    apply();

    // Next may swap the <title> element or just its text, so watch the head.
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [title]);
}
