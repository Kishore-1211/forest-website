# 🌲 Forest Website — Project Requirements

## Project Overview

Forest is a premium cinematic, scroll-driven website inspired by Apple product pages and Awwwards-winning experiences.

The website tells a visual story as the visitor scrolls through a living forest. Instead of presenting independent sections, the entire experience should feel like one continuous journey through nature.

The project prioritizes:
- Immersive storytelling
- Smooth animations
- High performance
- Clean architecture
- Modular components
- Production-quality code

---

## Project Vision

The visitor should feel like they are walking through a magical forest.

Every scroll should reveal something new.

Animations should support storytelling rather than exist for decoration.

The website should feel calm, premium, and cinematic.

---

## Core Experience

The emotional journey is:

```
Arrival → Curiosity → Wonder → Immersion → Calm → Resolution
```

---

## Website Structure

### 1. Loading Screen
**Purpose:** Prepare assets and create anticipation.

### 2. Hero Forest
**Purpose:** Introduce the forest with a cinematic opening.

### 3. Story
**Purpose:** Explain the narrative with minimal copy and one strong visual.

### 4. Signature 3D Squirrel Scene
**Purpose:** Deliver the single "wow" moment of the experience. This is the only real-time 3D section.

### 5. Magical Forest
**Purpose:** Slow the pace after the 3D scene.

### 6. Final CTA
**Purpose:** End the story with one clear action.

### 7. Footer
**Purpose:** Provide navigation and utility.

---

## Technical Goals

The website should be:
- Responsive
- Fast
- Accessible
- Modular
- Easy to maintain
- SEO friendly

---

## Performance Goals

Target:
- Lighthouse 90+
- Lazy loading
- Optimized images
- Optimized videos
- Optimized 3D assets

---

## Development Principles

Always prefer:
- Simple solutions over complex ones.
- Reusable components over duplicated code.
- Performance over excessive animations.
- Quality over quantity.
- One exceptional feature is better than ten average ones.

---

## Out of Scope (Version 1)

Do NOT build:
- User authentication
- CMS integration
- Backend services
- Dashboard
- User accounts
- Complex particle systems
- Multiple 3D scenes
- Multiplayer or interactive game mechanics

---

## Success Criteria

The project is successful if:
- The experience feels cinematic.
- Scrolling feels smooth.
- The 3D squirrel scene becomes the highlight.
- The site performs well on desktop and mobile.
- The codebase remains clean and easy to extend.

---

## Asset Budget (v1)

**Images (4):** hero background, story image, magical forest image, CTA background.

**Videos (2):** hero cinematic scroll sequence, magical fog/light sequence.

**3D Models (3):** one squirrel, one tree, one rock.

**Audio (1, optional):** one ambient forest loop.

---

## Animation Stack

- **Lenis** — smooth scroll driver for the whole page.
- **GSAP + ScrollTrigger** — all animation outside the 3D section (reveals, pinning, video scrub, parallax).
- **React Three Fiber** — mounted only inside the Signature 3D Squirrel Scene.

---

## Implementation Roadmap

1. **Phase 0 — Foundation:** Lenis + GSAP ScrollTrigger integration, `useReducedMotion` and `useInView` hooks.
2. **Phase 1 — Static skeleton:** all 7 sections built as static, unanimated, responsive layout with placeholder assets.
3. **Phase 2 — Non-3D animation pass:** Loading Screen, Hero scroll-scrub, Story reveal, Magical Forest loop, Final CTA reveal, ambient audio toggle.
4. **Phase 3 — Signature 3D Squirrel Scene:** tree/rock/ground first, squirrel + animation states, fog + particles last, scroll-driven camera dolly, low-end video fallback.
5. **Phase 4 — Performance pass:** Lighthouse audit, video/model compression, lazy-mount verification, `prefers-reduced-motion` pass across all sections.
6. **Phase 5 — QA & polish:** cross-device testing, scroll-jank profiling, final easing/timing pass.
