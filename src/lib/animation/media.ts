const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Non-hook reduced-motion check for use inside plain GSAP code (timelines,
 * factories) that runs outside React's render cycle. Components should use
 * `useReducedMotion` instead so they re-render on change.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}
