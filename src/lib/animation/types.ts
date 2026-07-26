import type { DURATION } from "./constants";
import type { EASE } from "./easings";

export type DurationKey = keyof typeof DURATION;
export type EasingKey = keyof typeof EASE;

/** Overrides accepted by the reveal factories in reveal.ts. */
export interface RevealOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  /** Translate distance in px, for fade+translate variants. */
  distance?: number;
}

/** A from/to pair a section can hand to gsap.fromTo() or timeline.fromTo(). */
export interface RevealTween {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
}
