"use client";

import type { ReactNode } from "react";
import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  // "sm" (default) preserves every existing call site's width unchanged.
  // "md"/"lg" are for content that needs more room (grids, multi-column
  // fields, longer lists) — still fully responsive since the backdrop's
  // p-4 gutter + w-full on the dialog cap it below the viewport on narrow
  // screens regardless of which max-width tier is picked.
  size?: "sm" | "md" | "lg";
}

const sizeMaxWidth: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-xl",
  lg: "max-w-2xl",
};

function subscribeNoop() {
  return () => {};
}

// document.body only exists client-side; this avoids rendering the portal during SSR.
function useIsMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

export default function Modal({ open, onClose, title, children, size = "sm" }: ModalProps) {
  const t = useTranslations("common.states");
  const mounted = useIsMounted();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="z-50 fixed inset-0 flex justify-center items-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className={`flex flex-col bg-surface shadow-xl border border-border rounded-2xl w-full ${sizeMaxWidth[size]} max-h-[85vh] overflow-hidden`}
      >
        {title && (
          <div className="flex justify-between items-center px-5 py-4 border-border border-b shrink-0">
            <h2 className="font-semibold text-text-primary text-base">
              {title}
            </h2>

            <button
              type="button"
              aria-label={t("close")}
              onClick={onClose}
              className="hover:bg-surface-muted p-1 rounded-lg text-text-secondary hover:text-text-primary transition"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* The one place a max-height + scroll is applied — every modal gets
            the same 85vh cap and scrolls its body once content exceeds it,
            with the header (if any) staying pinned, rather than each modal
            hand-rolling its own (previously inconsistent: some had none,
            others 70vh or 75vh on an inner div). */}
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
