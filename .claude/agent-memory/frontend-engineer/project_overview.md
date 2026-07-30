---
name: project-overview
description: Forest website — 7-section scroll experience, architecture decisions, key file paths
metadata:
  type: project
---

## Sections (in order, src/sections/)
1. LoadingScreen — fixed overlay, z-50, fades out after 1500ms display + 600ms GSAP fade
2. HeroForest — FrameSequence (480 frames, /frames/), pinned ScrollTrigger 800% scroll, text entrance on mount
3. Story — ForestScene parallax layers, short pin (+=40%), text fade-in/out scrub
4. SquirrelScene — R3F canvas (dynamic import, SSR false), CameraRig on scroll, pinned 150%
5. MagicalForest — magic.avif + magic-fog video loop overlay, parallax image
6. FinalCTA — cta-bg.avif background, fade-in on enter
7. Footer — static, no animations

## Key Architecture
- `useReveal<T>()` — provides ref + gsap.context + addToContext + prefersReducedMotion. All sections use this.
- `scrollTriggerDefaults(trigger, overrides)` — baseline ScrollTrigger config, toggleActions: play/none/none/reverse
- `fadeIn()` / `fadeInUp()` — animation factories from src/lib/animation/reveal.ts; collapse instantly under reduced-motion
- `useLenis()` — syncs Lenis with GSAP ticker, wraps whole app via SmoothScrollProvider
- `cn()` — simple filter+join, NOT tailwind-merge (no deduplication of conflicting classes)

## Design Tokens (globals.css + @theme inline)
Colors: --forest-green #1F4D36, --deep-forest #163020, --moss #6B8E23, --warm-gold #D4A017, --soft-white #F7F7F2, --charcoal #1B1B1B, --fog-gray #C8D0C8
Radii: --radius-card 20px, --radius-image 16px (buttons use rounded-full)
Fonts: Geist Sans + Geist Mono (CSS vars --font-sans, --font-mono)

## Animation Constants (src/lib/animation/constants.ts)
DURATION: fast 0.25s, normal 0.6s, large 1.0s
EASE: out2 (power2.out), out3 (power3.out)
REVEAL_DISTANCE: 24px, STAGGER: 0.15s

## Assets Available
Images: /images/hero-bg.avif+webp, cta-bg.avif+webp, magic.avif+webp
Videos: /videos/magic-fog.webm+mp4
Models: /models/squirrel.glb, tree.glb, rock.glb
Forest layers: /forest/sky.jpg, sun-rays.jpg, trees-back.jpg, tree-mid.jpg, tree-front.jpg, grass.jpg, fog.png
Frames: /frames/frame_0001.png → frame_0480.png (480 frames for hero scrub)

## SectionContainer
Handles bg color, fg color, scrim, optional backgroundImage. Has TONE map for 4 backgrounds. Does NOT support animated backgrounds (sections that need parallax render their own Image element).

## Navbar
NOT YET BUILT as of initial analysis. DESIGN_SYSTEM.md explicitly reserves glass effect for navigation.

## Known Bugs / Gaps (as of 2026-07-30)
1. FrameSequence.tsx className duplication — canvas has hardcoded `absolute inset-0 w-full h-full object-cover` AND appends className prop (which HeroForest passes with the same classes)
2. FogLayer imported in ForestScene.tsx but not rendered — fog.png asset exists
3. No Navbar component exists
4. No scroll indicator in Hero
5. All placeholder copy in Story, MagicalForest, FinalCTA
6. Hero text animation timeline fires immediately on mount (runs under loading screen, so users see static final state when loading exits)
7. Footer links have no hover treatment
8. LoadingScreen has no progress bar (ANIMATION.md requires one)
