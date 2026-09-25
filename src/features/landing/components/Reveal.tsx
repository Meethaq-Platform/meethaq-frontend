"use client";

import { useRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { useScrollReveal } from "../hooks/useScrollReveal";

interface RevealProps {
  children: ReactNode;
  as?: "div" | "li";
  /** Stagger offset in ms, for items revealed in sequence. */
  delay?: number;
  className?: string;
}

// The landing page's one entrance motion: fade in and rise 14px, once.
// The hidden state is motion-safe only, so reduced motion never hides
// anything, even before hydration.
const base =
  "motion-safe:transition-[opacity,translate] motion-safe:duration-600 motion-safe:ease-[ease-out]";
const hidden = "motion-safe:opacity-0 motion-safe:translate-y-3.5";

export function Reveal({ children, as = "div", delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const isRevealed = useScrollReveal(ref);
  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={twMerge(base, !isRevealed && hidden, className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
