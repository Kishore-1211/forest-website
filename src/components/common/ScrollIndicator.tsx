"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Subtle "scroll to continue" hint for the hero section.
 * Uses a slow sine-oscillation (not bounce — per ANIMATION.md) and fades
 * out as the user begins scrolling into the hero's pinned track.
 *
 * Positioned absolutely so the parent section needs `position: relative` —
 * SectionContainer already supplies this via its base classes.
 */
export function ScrollIndicator() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    // Walk up to the nearest section element — we'll use it as the
    // ScrollTrigger's trigger so the fade-out is scoped to the hero pin.
    const section = el.closest<HTMLElement>("section[data-section]");

    const ctx = gsap.context(() => {
      // Slow vertical float: sine.inOut keeps it smooth and natural, no bounce.
      gsap.to(el, {
        y: 10,
        duration: 1.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Fade out progressively as the scrub begins so the indicator
      // never competes with the frame-sequence animation.
      if (section) {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=20%",
          scrub: true,
          onUpdate: (self) => {
            gsap.set(el, { opacity: Math.max(0, 1 - self.progress * 4) });
          },
        });
      }
    }, ref);

    return () => ctx.revert();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-soft-white/50 pointer-events-none select-none"
    >
      <span className="text-[10px] font-normal tracking-[0.2em] uppercase">
        Scroll
      </span>
      {/* Chevron arrow — thin strokes, consistent with DESIGN_SYSTEM.md icon guidance */}
      <svg
        width="14"
        height="20"
        viewBox="0 0 14 20"
        fill="none"
        aria-hidden
        className="text-current"
      >
        <line
          x1="7"
          y1="0"
          x2="7"
          y2="13"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <polyline
          points="2,9 7,15 12,9"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
