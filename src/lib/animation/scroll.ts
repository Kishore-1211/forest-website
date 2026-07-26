import type { ScrollTrigger } from "@/lib/gsap";

type ScrollTriggerVars = Parameters<typeof ScrollTrigger.create>[0];

/**
 * Reusable ScrollTrigger baseline. Sections spread their own overrides on
 * top rather than repeating trigger/toggleActions boilerplate everywhere.
 */
export function scrollTriggerDefaults(
  trigger: ScrollTriggerVars["trigger"],
  overrides: Partial<ScrollTriggerVars> = {},
): ScrollTriggerVars {
  return {
    trigger,
    start: "top top",
    end: "bottom top",
    toggleActions: "play none none reverse",
    ...overrides,
  };
}
