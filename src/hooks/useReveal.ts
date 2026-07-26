"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Reusable reveal infrastructure: a ref to scope animations to, a
 * gsap.context() bound to that ref's lifetime (auto-reverted on unmount, so
 * tweens/ScrollTriggers a section adds never leak across route changes),
 * and the current reduced-motion state. Builds no timeline itself — each
 * section adds its own inside `addToContext`, sourced from lib/animation.
 *
 * Call addToContext from an effect that runs after this hook's own (i.e.
 * declared below it in the same component), since the context is created
 * on mount.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const contextRef = useRef<gsap.Context | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {}, ref);
    contextRef.current = ctx;

    return () => {
      ctx.revert();
      contextRef.current = null;
    };
  }, []);

  function addToContext(fn: () => void) {
    contextRef.current?.add(fn);
  }

  return { ref, prefersReducedMotion, addToContext };
}
