# Animation Infrastructure

Shared foundation for scroll/reveal animation. No section timelines live here.

## Where things live

- **`lib/gsap.ts`** — the only place plugins are registered (`ScrollTrigger` now;
  `SplitText` placeholder for later). Never call `gsap.registerPlugin` anywhere else.
- **`lib/lenis.ts` / `hooks/useLenis.ts`** — smooth-scroll driver, synced into GSAP's
  ticker. Already wired into `SmoothScrollProvider` at the root layout.
- **`lib/animation/`** (this folder) — pure utilities: durations, easings,
  reduced-motion checks, reveal tween factories, ScrollTrigger defaults, shared types.
  Nothing in here creates or plays an animation.
- **`hooks/useReveal.ts`** — per-component infra: a ref to scope to, a
  `gsap.context()` that auto-reverts on unmount, and the current
  reduced-motion flag.
- **Section-specific timelines** — live inside each section component
  (`src/sections/<Section>/<Section>.tsx`), built from the pieces above.
  This is the *only* place `gsap.timeline()` should be called for that
  section's own choreography.

## How a future section builds an animation

```tsx
"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { fadeInUp } from "@/lib/animation";
import { useReveal } from "@/hooks/useReveal";

export function ExampleSection() {
  const { ref, prefersReducedMotion, addToContext } = useReveal<HTMLDivElement>();

  useEffect(() => {
    addToContext(() => {
      const title = ref.current?.querySelector("[data-title]");
      if (!title) return;

      const tween = fadeInUp();
      gsap.timeline({
        scrollTrigger: ScrollTrigger.create({ trigger: ref.current!, start: "top 80%" }),
      }).fromTo(title, tween.from, tween.to);
    });
  }, [prefersReducedMotion, addToContext]);

  return <div ref={ref} data-section="example">{/* ... */}</div>;
}
```

- Pull reveal vars from `reveal.ts` instead of hand-writing tween numbers.
- Pull ScrollTrigger config from `scrollTriggerDefaults()` instead of repeating
  `toggleActions` strings.
- Read `prefersReducedMotion` (or rely on the reveal factories already
  collapsing to the resting state) before adding scroll-scrubbed motion.
- Everything added via `addToContext` is reverted automatically when the
  section unmounts — don't manually track ScrollTrigger instances to kill.

## Data attributes

`data-section`, `data-title`, `data-description`, `data-reveal` are already
stamped onto `SectionContainer`, `SectionTitle`, and `SectionDescription`.
Select against these instead of adding new className hooks or refs when a
timeline only needs to reach a child element.
