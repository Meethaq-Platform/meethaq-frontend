"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.15,
  rootMargin: "0px 0px -8% 0px",
};

const noopSubscribe = () => () => {};

// True when the element should just be shown: the visitor prefers reduced
// motion, or the browser has no IntersectionObserver. False on the server.
function useSkipAnimation() {
  return useSyncExternalStore(
    noopSubscribe,
    () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window),
    () => false,
  );
}

/**
 * Reveals an element the first time it scrolls into view. Returns true once
 * it has been revealed; it never goes back to false, so scrolling up and
 * down again doesn't replay the animation.
 */
export function useScrollReveal(ref: RefObject<Element | null>) {
  const skipAnimation = useSkipAnimation();
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (skipAnimation || !element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setHasEntered(true);
      observer.unobserve(entry.target);
    }, OBSERVER_OPTIONS);

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, skipAnimation]);

  return skipAnimation || hasEntered;
}
