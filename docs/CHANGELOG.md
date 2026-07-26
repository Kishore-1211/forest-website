# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows sprint-based versioning aligned with `ROADMAP.md`
rather than semantic release versions until Sprint 7C (v1.0.0 launch).

---

## [Unreleased]

### Added
- Reusable animation infrastructure (`src/lib/animation/`) — durations,
  approved easings, reduced-motion helpers, reveal tween factories,
  ScrollTrigger defaults, shared types.
- `useReveal` hook providing scoped `gsap.context()` lifecycle management.
- `data-title`, `data-description`, `data-reveal` attributes on shared UI
  components for future animation targeting.
- `docs/` project management structure (roadmap, devlog, sprint template,
  code review checklist).
- `prompts/` directory with placeholder briefs for every planned sprint.
- Hero cinematic entrance timeline (section fade, headline fade+translate,
  description reveal, CTA fade) built from `lib/animation` factories.
- Pinned/scrubbed `ScrollTrigger` on the Hero section, extending its scroll
  track to prepare for a future background video.
- Story section: short pinned fade-in/hold/fade-out timeline over its
  headline and paragraphs, scrubbed to scroll position.
- Final CTA section: fade + upward-motion reveal-on-enter for headline,
  description, and button group.
- Primary `Button` hover state (brightness increase, 1.02 scale, soft
  shadow) per `DESIGN_SYSTEM.md`, respecting `prefers-reduced-motion` via
  `motion-reduce:` variants.
- `.claude/settings.json` — allowlisted the one safe, exact-match read-only
  command found in transcript history (`npx tsc --noEmit`).
- `three` and `@react-three/fiber` dependencies, plus `@types/three`.
- Bare R3F `Canvas` with base ambient/directional lighting rig
  (`SquirrelScene/SquirrelCanvas.tsx`), lazy-mounted via `useInView` and
  dynamically imported with `ssr: false` so `three`/`@react-three/fiber`
  never enter the server bundle.
- Squirrel Scene environment (`SquirrelScene/environment/{Ground,Tree,Rock}.tsx`)
  and a procedurally-animated `Squirrel.tsx` — **placeholder geometry**
  standing in for `tree.glb`/`rock.glb`/`squirrel.glb`, each explicitly
  commented with its swap point. Scene fog and shadow-casting lighting added.
- `SectionContainer` gained an optional `backgroundImage` prop (static,
  full-bleed, with a tone-matched contrast scrim) for sections that don't
  need to animate their image (`FinalCTA`).
- Hero: background image + a scroll-scrubbed `<video>` (currentTime driven
  by the existing pin's `ScrollTrigger.onUpdate`), per ASSETS.md's
  "scroll-controlled opening sequence."
- Story: background image with continuous parallax drift, integrated into
  its existing pinned timeline (was deferred in Sprint 2C pending a
  defined image target).
- Magical Forest: background image with parallax, a looping ambient
  `magic-fog` video layer, and a gentle (non-pinned) text reveal-on-enter.
- Final CTA: static `cta-bg` background image via `SectionContainer`.
- `AudioToggle` (`components/common/`): user-controlled, glass-styled
  floating control for optional forest ambience — never autoplays,
  mounted once at the root layout.
- `next.config.ts`: `productionBrowserSourceMaps: true`, closing
  Lighthouse's "valid-source-maps" best-practices audit.
- `src/lib/site.ts`: shared `SITE_URL`/`SITE_NAME`/`SITE_DESCRIPTION`
  constants for metadata/sitemap/robots generation.
- `src/app/sitemap.ts`, `src/app/robots.ts`: generated sitemap/robots routes.
- Root metadata expanded with `metadataBase`, Open Graph, Twitter card,
  and a `WebSite` JSON-LD block.
- Skip-to-main-content link in the root layout, targeting `#main-content` on `<main>`.

### Changed
- `src/lib/gsap.ts` — added a commented `SplitText` registration placeholder.
- `src/sections/HeroForest/HeroForest.tsx` — converted to a client component
  to host the entrance timeline and ScrollTrigger.
- `src/sections/Story/Story.tsx`, `src/sections/FinalCTA/FinalCTA.tsx` —
  converted to client components to host their timelines.
- `src/components/ui/Button.tsx` — primary variant now carries hover/
  transition classes (previously explicitly deferred to this phase).
- `src/sections/SquirrelScene/SquirrelScene.tsx` — now lazily mounts the
  R3F canvas instead of rendering static placeholder-only copy.
- `src/app/layout.tsx` — mounts `AudioToggle` alongside `SmoothScrollProvider`.

### Fixed
- `LoadingScreen` never dismissed — it had no timer, effect, or state to
  remove itself, so the `fixed inset-0 z-50` overlay covered the site
  permanently. It now displays for 1.5s, fades out over 0.6s
  (`power2.out`), and unmounts, matching ANIMATION.md's 1.5–2.5s budget.
  Skips the fade and dismisses instantly under `prefers-reduced-motion`.

### Removed
- _Nothing yet._

### Known Issues
- Story's "gentle image parallax" (ANIMATION.md) is deferred — the section
  has no image element yet (arrives in Sprint 4A); text reveal/pin/fade
  is implemented, parallax will layer on once the image exists.
- Hero's pinned scroll track has no background video yet (placeholder
  background only, per Sprint 2B scope — video lands in Sprint 4B).
- Squirrel Scene's tree/rock/ground/squirrel are placeholder primitive
  geometry, not the photorealistic GLB assets ASSETS.md specifies —
  `public/models/` has no `tree.glb`/`rock.glb`/`squirrel.glb` yet. Each
  placeholder component is commented with its exact swap point. No camera
  path yet (Sprint 3D).
- All Phase 4 media integration points to real ASSETS.md filenames, but
  none of those files exist yet in `public/{images,videos,audio}/` — every
  image/video renders as a broken/empty element until real files land at
  those exact paths. No code changes needed once they do.
- `SITE_URL` is a placeholder domain (`forest-website.example.com`) until
  Sprint 7A sets `NEXT_PUBLIC_SITE_URL` for the real deployed domain —
  Open Graph/sitemap/robots all resolve against it in the meantime.
- 6B/6C are verified via Lighthouse and code review only — no manual
  screen-reader walkthrough or real cross-browser/device matrix was run
  (no assistive-tech device or browser lab available in this environment).
- `npm audit` reports 3 pre-existing high-severity advisories (postcss/sharp,
  transitively via `next`'s own dependency tree) — unrelated to this
  sprint's additions. The only fix path is `npm audit fix --force`, which
  would downgrade Next.js to 9.3.3 and break the app; not applied.

---

## Template for future entries

```md
## [sprint-id] - YYYY-MM-DD

### Added
-

### Changed
-

### Fixed
-

### Removed
-

### Known Issues
-
```
