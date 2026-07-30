"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Logo } from "@/components/common/Logo";
import { DURATION, EASE, AFTER_LOADING_DELAY } from "@/lib/animation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const NAV_LINKS = [
  { label: "Story", href: "#story" },
  { label: "The Moment", href: "#squirrel-scene" },
  { label: "Magic", href: "#magical-forest" },
] as const;

/**
 * Fixed glassmorphic navigation per DESIGN_SYSTEM.md ("Glass Effects → Navigation").
 * Fades in after the loading screen completes, then hides on scroll-down and
 * re-appears on scroll-up so it never competes with the cinematic sections.
 */
export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    if (prefersReducedMotion) {
      // No entrance choreography — just make it immediately visible.
      gsap.set(nav, { opacity: 1, y: 0 });
      return;
    }

    // Start invisible so it never flashes above the loading screen (z-50).
    gsap.set(nav, { opacity: 0, y: -8 });

    let hasEntered = false;

    const ctx = gsap.context(() => {
      // Entry: sync with the loading screen's exit (AFTER_LOADING_DELAY in constants.ts).
      gsap.to(nav, {
        opacity: 1,
        y: 0,
        duration: DURATION.normal,
        delay: AFTER_LOADING_DELAY,
        ease: EASE.out2,
        onComplete: () => {
          hasEntered = true;
        },
      });

      // Scroll behavior: hide on scroll-down, re-appear on scroll-up.
      // ScrollTrigger is synced with Lenis via gsap.ticker (useLenis.ts),
      // so self.scroll() and self.direction are both Lenis-smoothed values.
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          // Don't interfere before the entry animation has completed,
          // and ignore tiny scroll positions (first 120px) so the nav
          // doesn't flash away immediately on page load.
          if (!hasEntered || self.scroll() < 120) return;

          if (self.direction === 1) {
            // Scrolling down — slide off-screen above.
            gsap.to(nav, {
              y: -80,
              opacity: 0,
              duration: DURATION.fast,
              ease: EASE.out2,
              overwrite: "auto",
            });
          } else {
            // Scrolling up — bring it back.
            gsap.to(nav, {
              y: 0,
              opacity: 1,
              duration: DURATION.fast,
              ease: EASE.out2,
              overwrite: "auto",
            });
          }
        },
      });
    }, navRef);

    return () => ctx.revert();

    // prefersReducedMotion is read once at mount, matching the pattern
    // established in HeroForest.tsx and SquirrelCanvas.tsx.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-40 h-16 backdrop-blur-md bg-black/20 border-b border-white/5"
    >
      <div className="flex h-full w-full max-w-[1440px] mx-auto items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Logo — anchor back to the top */}
        <a
          href="#hero-forest"
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-gold"
          aria-label="Forest — return to top"
        >
          <Logo className="text-soft-white" />
        </a>

        {/* Desktop links — hidden on mobile (full mobile menu is out of scope for v1) */}
        <ul className="hidden sm:flex items-center gap-8" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="text-sm font-medium text-soft-white/70 hover:text-soft-white transition-colors duration-[250ms] rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-gold"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Minimal CTA — pill outline per DESIGN_SYSTEM.md (Secondary Button) */}
        <a
          href="#final-cta"
          className="hidden sm:inline-flex items-center rounded-full border border-soft-white/25 px-5 py-2 text-sm font-medium text-soft-white/80 hover:text-soft-white hover:border-soft-white/50 transition-colors duration-[250ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-gold"
        >
          Begin
        </a>
      </div>
    </nav>
  );
}
