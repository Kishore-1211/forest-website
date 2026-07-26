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
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-charcoal text-soft-white"
    >
      <Logo />
      <p className="text-sm font-normal tracking-wide">Loading Forest...</p>
    </div>
  );
}
