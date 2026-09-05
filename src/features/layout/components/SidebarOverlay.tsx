"use client";

import { useSidebar } from "../context/SidebarContext";

export function SidebarOverlay() {
  const { isMobileOpen, closeMobile } = useSidebar();

  if (!isMobileOpen) {
    return null;
  }

  return (
    <div
      onClick={closeMobile}
      aria-hidden="true"
      className="md:hidden z-40 fixed inset-0 bg-black/40"
    />
  );
}
