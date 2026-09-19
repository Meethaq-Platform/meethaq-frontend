"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

import { CancelProjectButton } from "./CancelProjectButton";

interface ProjectOverflowMenuProps {
  projectId: number;
}

// Houses destructive/secondary actions (Cancel Project) away from the
// primary Edit action, so red doesn't sit visually adjacent to the
// constructive primary button in the header.
export function ProjectOverflowMenu({ projectId }: ProjectOverflowMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="More actions"
        aria-expanded={open}
        className="flex justify-center items-center hover:bg-surface-muted rounded-lg w-9 h-9 text-text-secondary hover:text-text-primary transition"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="top-full right-0 z-20 absolute bg-surface shadow-lg mt-2 border border-border rounded-xl w-52 overflow-hidden">
          <CancelProjectButton projectId={projectId} onTriggerClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
