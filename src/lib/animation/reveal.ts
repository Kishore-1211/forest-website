import { DURATION, REVEAL_DISTANCE } from "./constants";
import { EASE } from "./easings";
import { prefersReducedMotion } from "./media";
import type { RevealOptions, RevealTween } from "./types";

/**
 * Reusable fade/translate animation factories. These return plain
 * from/to vars objects — they don't create or play any tween. A section
 * hands the result to its own gsap.timeline().fromTo(target, tween.from, tween.to).
 *
 * Under prefers-reduced-motion, `from` collapses to the resting state and
 * duration/delay drop to 0, so a fromTo() call still resolves instantly to
 * the correct final appearance instead of requiring separate branches.
 */

export function fadeIn(overrides: RevealOptions = {}): RevealTween {
  const reduced = prefersReducedMotion();

  return {
    from: { opacity: reduced ? 1 : 0 },
    to: {
      opacity: 1,
      duration: reduced ? 0 : (overrides.duration ?? DURATION.normal),
      delay: reduced ? 0 : (overrides.delay ?? 0),
      ease: overrides.ease ?? EASE.out2,
    },
  };
}

export function fadeInUp(overrides: RevealOptions = {}): RevealTween {
  const reduced = prefersReducedMotion();
  const distance = overrides.distance ?? REVEAL_DISTANCE;

  return {
    from: { opacity: reduced ? 1 : 0, y: reduced ? 0 : distance },
    to: {
      opacity: 1,
      y: 0,
      duration: reduced ? 0 : (overrides.duration ?? DURATION.normal),
      delay: reduced ? 0 : (overrides.delay ?? 0),
      ease: overrides.ease ?? EASE.out3,
    },
  };
}
