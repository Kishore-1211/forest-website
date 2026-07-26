"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lenisOptions } from "@/lib/lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Drives the whole page's scroll feel. Syncs Lenis into GSAP's ticker so
 * every ScrollTrigger stays in lockstep with smoothed scroll position
 * instead of raw native scroll events.
 */
export function useLenis() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis(lenisOptions);
    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);
}
