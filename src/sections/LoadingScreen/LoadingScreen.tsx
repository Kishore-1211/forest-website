"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/common/Logo";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ANIMATION.md: "smooth fade into Hero, duration 1.5–2.5 seconds" — this is
// the display time before the fade starts, not the whole budget.
const DISPLAY_DURATION = 1500;

export function LoadingScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const bar = progressBarRef.current;

    if (prefersReducedMotion) {
      // No animation — jump straight to fully-loaded state.
      if (bar) bar.style.width = "100%";
    } else if (bar) {
      // Animate the progress bar from 0 → 100% over the display duration.
      // ease: "none" gives a linear fill so it reads as a genuine load indicator.
      gsap.fromTo(
        bar,
        { width: "0%" },
        { width: "100%", duration: DISPLAY_DURATION / 1000, ease: "none" },
      );
    }

    const timer = setTimeout(() => {
      if (prefersReducedMotion || !ref.current) {
        setIsVisible(false);
        return;
      }

      gsap.to(ref.current, {
        opacity: 0,
        duration: DURATION.normal,
        ease: EASE.out2,
        onComplete: () => setIsVisible(false),
      });
    }, DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  if (!isVisible) return null;

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      data-section="loading-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-charcoal text-soft-white"
    >
      <Logo />

      {/* Progress indicator — ANIMATION.md: "Progress indicator" */}
      <div className="w-32 h-px bg-soft-white/10 overflow-hidden rounded-full">
        <div
          ref={progressBarRef}
          className="h-full bg-warm-gold rounded-full"
          style={{ width: "0%" }}
          aria-hidden
        />
      </div>

      <p className="text-xs font-normal tracking-[0.2em] uppercase text-soft-white/40">
        Loading Forest
      </p>
    </div>
  );
}
