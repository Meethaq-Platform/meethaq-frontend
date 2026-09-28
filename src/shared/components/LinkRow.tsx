"use client";

import type { MouseEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

interface LinkRowProps {
  href: string;
  className?: string;
  children: ReactNode;
}

const INTERACTIVE = "a, button, input, select, textarea, label, [role='button']";

// A table row that opens `href` when clicked anywhere. Rows can't be wrapped in
// a link, so the row handles the mouse while each table keeps its own <Link>
// in the last cell for keyboard and screen-reader users. Clicks on controls
// inside the row, and clicks that end a text selection, are left alone.
export default function LinkRow({ href, className, children }: LinkRowProps) {
  const router = useRouter();

  function shouldIgnore(event: MouseEvent<HTMLTableRowElement>) {
    return (
      event.defaultPrevented ||
      (event.target as HTMLElement).closest(INTERACTIVE) !== null ||
      Boolean(window.getSelection()?.toString())
    );
  }

  return (
    <tr
      onClick={(event) => {
        if (shouldIgnore(event)) return;
        // Match link behavior: Ctrl/Cmd-click opens a new tab.
        if (event.ctrlKey || event.metaKey) {
          window.open(href, "_blank", "noopener");
        } else {
          router.push(href);
        }
      }}
      onAuxClick={(event) => {
        if (event.button === 1 && !shouldIgnore(event)) {
          window.open(href, "_blank", "noopener");
        }
      }}
      className={twMerge("cursor-pointer", className)}
    >
      {children}
    </tr>
  );
}
