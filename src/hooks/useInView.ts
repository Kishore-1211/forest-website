"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  rootMargin?: string;
  threshold?: number;
  /** Stop observing after the first time the target enters view. */
  once?: boolean;
}

/**
 * Lazily signals when an element nears the viewport, used to defer mounting
 * heavy sections (video, the R3F canvas) until they're actually needed.
 */
export function useInView<T extends HTMLElement>({
  rootMargin = "200px",
  threshold = 0,
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return { ref, isInView };
}
