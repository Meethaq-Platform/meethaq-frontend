"use client";

import { useEffect } from "react";

// Sets the browser tab title to reflect where the user actually is (e.g.
// "Projects/Company Website") instead of the static brand-name default.
// Static section titles are set via each page's own `metadata` export
// instead — this hook is only for titles that depend on client-fetched data
// (a project/client/milestone name), which isn't known until after render.
export function usePageTitle(title: string | null | undefined) {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
}
