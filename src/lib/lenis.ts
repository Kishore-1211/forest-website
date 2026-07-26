import type { LenisOptions } from "lenis";

// Shared Lenis config so every mount of the smooth-scroll driver behaves identically.
export const lenisOptions: LenisOptions = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
};
