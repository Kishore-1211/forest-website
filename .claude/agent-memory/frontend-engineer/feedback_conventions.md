---
name: feedback-conventions
description: Coding patterns established in the Forest codebase — animation, component, accessibility conventions
metadata:
  type: feedback
---

## GSAP Animation Pattern
All sections use `useReveal<T>()` hook. Animations go inside `addToContext(fn)`. Context is reverted on unmount.
**Why:** Prevents ScrollTrigger leaks across route changes and HMR.
**How to apply:** Always use addToContext for any GSAP/ScrollTrigger created inside a section.

## No Bounce/Elastic Easings
Only power2.out and power3.out are approved (EASE.out2, EASE.out3 from src/lib/animation/easings.ts).
**Why:** ANIMATION.md explicitly bans bounce/elastic. Premium/calm feel.
**How to apply:** Never use bounce, elastic, or spring easings anywhere. sine.inOut is acceptable for oscillating loops.

## Reduced Motion — Two Patterns
1. Scroll-driven animations (pins, scrubs): skip creating them entirely when prefersReducedMotion is true
2. Text reveals (fadeIn, fadeInUp): the factories handle it — they collapse to zero-duration at full opacity
**Why:** Pinned scroll tracks change layout behavior (scroll distance changes), so you can't just "instant" them. Text reveals are purely visual so instant is fine.
**How to apply:** Check prefersReducedMotion before creating ScrollTrigger.create() for pins/scrubs. Don't check it before calling fadeIn/fadeInUp — they already handle it.

## Canvas (FrameSequence) Limitation
`cn()` in this project does NOT deduplicate Tailwind classes (it's a simple filter+join, not tailwind-merge).
**How to apply:** Avoid passing the same classes in both the component's internal className and via the prop. Use the prop for supplemental classes only.

## SectionContainer backgroundImage vs. Custom Image
Use SectionContainer's backgroundImage prop for static, unanimated backgrounds.
Render your own `<Image>` element directly when you need GSAP parallax — the prop is static-only.
**Why:** Consistency established by MagicalForest.tsx and Story.tsx which both need animated images.

## Lenis + ScrollTrigger Integration
Lenis is synced with GSAP ticker in useLenis.ts. ScrollTrigger.update() is called on each Lenis scroll event.
ScrollTrigger.create() without a trigger element (using start: 0, end: 'max') works for page-level tracking.
self.direction on a ScrollTrigger instance: 1 = scrolling down, -1 = scrolling up.

## HeroForest Animation Timing Gap
The hero text entrance timeline starts immediately on mount and runs for ~2 seconds, completing before the loading screen exits at ~2.1s. The loading screen masks this, so users never see the animation play.
**Fix:** Add `AFTER_LOADING_DELAY` constant and delay hero entry timeline by that amount.
