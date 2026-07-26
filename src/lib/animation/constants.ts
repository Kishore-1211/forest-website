/**
 * Shared timing/spacing primitives. Values pulled from DESIGN_SYSTEM.md
 * (Motion Timing) and ANIMATION.md (Motion Timing), reconciled to one
 * canonical scale so sections don't invent their own numbers.
 */

export const DURATION = {
  /** Small interactions — hover states, toggles. */
  fast: 0.25,
  /** Standard reveals — text, buttons. */
  normal: 0.6,
  /** Large reveals — hero moments, section transitions. */
  large: 1.0,
} as const;

export const DELAY = {
  none: 0,
  small: 0.1,
  medium: 0.2,
  large: 0.3,
} as const;

/** Default translate distance for fade+translate reveals, from the 8px spacing scale. */
export const REVEAL_DISTANCE = 24;

/** Default stagger between items in a revealed group. */
export const STAGGER = 0.15;
