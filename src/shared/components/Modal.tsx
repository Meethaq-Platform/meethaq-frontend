"use client";

import type { ReactNode } from "react";
import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

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

export default function Modal({ open, onClose, title, children }: ModalProps) {
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
        className="bg-surface shadow-xl border border-border rounded-2xl w-full max-w-sm overflow-hidden"
      >
        {title && (
          <div className="flex justify-between items-center px-5 py-4 border-border border-b">
            <h2 className="font-semibold text-text-primary text-base">
              {title}
            </h2>

            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="hover:bg-surface-muted p-1 rounded-lg text-text-secondary hover:text-text-primary transition"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
