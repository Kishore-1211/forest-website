/**
 * Approved easings only (ANIMATION.md: no bounce/elastic/spring).
 */
export const EASE = {
  out2: "power2.out",
  out3: "power3.out",
} as const;

export const DEFAULT_EASE = EASE.out2;
