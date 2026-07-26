# Development Journal

A running record of what actually happened each sprint — decisions,
surprises, and dead ends that `CHANGELOG.md` and `ROADMAP.md` don't capture.
Append one entry per sprint, most recent first.

---

## Entry Template

Copy this block for each new sprint entry:

```md
## YYYY-MM-DD — Sprint <id>

**Sprint:** <name, e.g. "2B — Hero Animation">

**Objective:**


**Completed Work:**
-

**Problems:**
-

**Solutions:**
-

**Lessons Learned:**
-

**Next Sprint:**

```

---

## Log

## 2026-07-24 — Bugfix: Loading Screen never dismisses

**Sprint:** N/A — reported bug, not a scheduled sprint

**Objective:**
User reported the site only ever shows the loading screen. Find and fix
the root cause; no new features.

**Completed Work:**
- Root cause: `LoadingScreen.tsx` was a purely static component (built in
  Sprint 1B as a placeholder shell) — `fixed inset-0 z-50` with no timer,
  effect, or state anywhere to remove it. It was rendered unconditionally
  in `page.tsx` and simply never went away. Confirmed via `grep` that no
  other file referenced any loading/dismiss logic at all.
  Nothing regressed this — the dismissal logic was never built in any
  sprint; ANIMATION.md specified "smooth fade into Hero, duration
  1.5–2.5 seconds" for the Loading Screen back in Sprint 0, but no sprint
  1B–2C ever implemented it (2A–2C only covered Hero/Story/CTA).
- Fix: added a `setTimeout`-driven dismissal — 1.5s display, then a
  0.6s `power2.out` fade via `gsap.to`, then `setIsVisible(false)`
  unmounts it entirely (not just hidden, so it can't block clicks/focus
  on Hero underneath). Under `prefers-reduced-motion`, skips the fade and
  unmounts immediately once the display timer elapses.
- Verified with real headless-Chrome screenshots (not just code
  reading): captured the page at `virtual-time-budget=200ms` (loading
  screen visible, confirms it still shows initially) and at `4000ms`
  (Hero fully rendered, loading screen gone, confirms the fix actually
  works end-to-end, not just in theory).

**Problems:**
- None beyond the missing logic itself.

**Solutions:**
- Kept this deliberately minimal — a local `useState` + `setTimeout` +
  one `gsap.to` call, not routed through `useReveal`/`gsap.context`,
  since this is a one-shot splash that unmounts itself rather than a
  persistent scroll-driven section. Matches "don't add new features."

**Lessons Learned:**
- A component with zero effects/state and a `fixed inset-0` class is a
  strong signal to check whether anything ever removes it — this should
  have been caught in Sprint 2A/2B's review pass, not by the user hitting
  it live.

**Next Sprint:**
Back to Phase 7 whenever hosting/domain details are available, or Phase
8 (Portfolio) in the meantime.

## 2026-07-24 — Sprint 6A, 6B & 6C

**Sprint:** 6A — SEO, 6B — Accessibility, 6C — Cross Browser Testing
(combined)

**Objective:**
Close out non-Lighthouse-scored SEO/accessibility gaps (sitemap, robots,
Open Graph, structured data, skip link), and assess cross-browser risk
where real testing isn't possible in this environment.

**Completed Work:**
- `src/lib/site.ts` — single source for `SITE_URL`/`SITE_NAME`/
  `SITE_DESCRIPTION`, consumed by metadata, sitemap, and robots so they
  can't drift out of sync.
- `src/app/sitemap.ts`, `src/app/robots.ts` — verified they actually
  build and serve correct output (`/sitemap.xml`, `/robots.txt`).
- Root `metadata` expanded: `metadataBase`, Open Graph (title/description/
  url/image/locale/type), Twitter summary_large_image card, `WebSite`
  JSON-LD.
- Skip-to-main-content link in the root layout (visually hidden until
  focused), targeting a new `id="main-content"` on `<main>`.
- Re-ran Lighthouse after all of the above: Accessibility 100, SEO 100,
  Best Practices 96 (unchanged) — confirmed no regression.
- Reviewed the codebase for cross-browser risk: video elements already
  ship dual `<source>` (webm + mp4) covering Safari's lack of WebM
  support; `next/image` re-encodes to whatever format the requesting
  browser negotiates via its `Accept` header regardless of the source
  file's own extension, so ASSETS.md's "ship AVIF + WebP" concern is
  already handled by the framework for anything going through
  `next/image` (everything here does) — no manual `<picture>` fallback
  needed. `backdrop-blur` (AudioToggle) and `motion-reduce:` are both
  broadly supported in current browser baselines.

**Problems:**
- Can't run a real cross-browser/device matrix (no Safari/Firefox/real
  mobile devices available here) or a manual screen-reader walkthrough
  (no assistive-tech device in this environment).

**Solutions:**
- Did what's actually verifiable: Lighthouse (which does check some
  accessibility-tree/ARIA correctness) plus a targeted code review for
  the specific cross-browser gaps that actually matter for this stack
  (video codecs, image format negotiation, CSS feature support). Logged
  the rest as a genuine gap rather than fabricating a browser test matrix.

**Lessons Learned:**
- `next/image`'s automatic format negotiation means ASSETS.md's dual-
  format asset requirement is more about what the designer exports than
  what the code needs to explicitly branch on — worth remembering before
  reflexively building a `<picture>` fallback for every image.

**Next Sprint:**
Phase 7 — Deployment/Monitoring/Release. Stopping here per the earlier
agreement: this phase needs real hosting credentials/DNS/environment
secrets I don't have and shouldn't act on unattended.

## 2026-07-24 — Sprint 5A, 5B & 5C

**Sprint:** 5A — Performance, 5B — Lighthouse Optimization, 5C —
Performance Audit (combined; ran real Lighthouse against a production
build rather than treating these as separate passes)

**Objective:**
Verify and, where actionable, close the gap to PROJECT.md's Lighthouse
90+ target across categories, on both desktop and mobile.

**Completed Work:**
- Built (`next build`) and served (`next start`) a real production
  build, then ran Lighthouse CLI against it (Chrome found at
  `C:\Program Files\Google\Chrome`, headless).
- **Desktop preset:** Performance 100, Accessibility 100, SEO 100,
  Best Practices 96.
- **Mobile preset (default throttling):** Performance 94, Accessibility
  100, SEO 100, Best Practices 96.
- Root-caused Best Practices' "valid-source-maps" flag (missing maps for
  large first-party JS) and fixed it via `productionBrowserSourceMaps: true`
  in `next.config.ts` — re-ran Lighthouse to confirm it cleared.
- Root-caused mobile LCP (3.0s) to the Hero entrance timeline itself: the
  LCP element is the Hero description paragraph, and Lighthouse's own
  "Render Delay" breakdown shows 85% of LCP time is spent waiting for our
  own GSAP fade-in to reach visible opacity (an element at `opacity: 0`
  isn't a valid LCP candidate, so LCP is measured at whenever the
  sequenced entrance tween actually reveals it).

**Problems:**
- The remaining Best Practices gap (96, not 100) is `errors-in-console`
  — the browser logging 404s for hero-bg/story/magic/cta-bg images and
  hero-cinematic/magic-fog videos, none of which exist yet. Not
  fixable without the real files; will clear itself once Phase 4's
  assets land.
- Mobile LCP at 3.0s is technically in Lighthouse's "needs improvement"
  band (good is <2.5s), driven entirely by the Hero entrance choreography
  approved in Sprint 2B.

**Solutions:**
- Left the Hero timing as-is rather than gutting the approved cinematic
  entrance to chase a marginal LCP number — PROJECT.md's own principle is
  "performance over excessive animations," not "performance over any
  animation," and every category is already comfortably above the 90+
  target (94 is the lowest score, on mobile Performance) even with this
  trade-off priced in. Documenting it here as an accepted, deliberate
  characteristic rather than silently shipping a design regression to
  move one number.

**Lessons Learned:**
- LCP timing and "cinematic slow reveal" are in genuine tension for any
  hero whose headline/body text is opacity-animated on load — worth
  keeping in mind for 6B (Accessibility) and any future copy changes:
  don't let the entrance sequence get longer without re-checking this.
- Chrome was already installed on this machine, so real Lighthouse runs
  (not estimates) were possible — worth checking for early in any future
  performance sprint rather than assuming it's unavailable.

**Next Sprint:**
Phase 6 — SEO, Accessibility, Cross-Browser Testing. SEO/Accessibility
Lighthouse categories are already 100/100, so 6A/6B's remaining work is
mostly the non-Lighthouse-scored items (sitemap, robots.txt, Open Graph,
manual keyboard/SR walkthrough) rather than starting from zero.

## 2026-07-24 — Sprint 4A, 4B & 4C

**Sprint:** 4A — Images, 4B — Video, 4C — Audio (combined; continuing the
same "build now, swap later" instruction into Phase 4)

**Objective:**
Wire real media integration (responsive images, scroll-scrubbed/looping
video, an ambient-audio toggle) against ASSETS.md's exact defined
filenames, so dropping the real files in later requires zero code changes.

**Completed Work:**
- `SectionContainer` gained an optional `backgroundImage` prop (fill
  `next/image` + a tone-matched contrast scrim) for sections with a
  static, unanimated background (`FinalCTA`).
- Story and Magical Forest render their own `<Image>` directly (not via
  that prop) so their existing/new timelines can target it by
  `[data-parallax]` for scroll-linked drift.
- Hero: added a `<video>` scrubbed via the existing pin `ScrollTrigger`'s
  `onUpdate` (`video.currentTime = self.progress * video.duration`) —
  extends 2B's ScrollTrigger rather than adding a second one.
- Magical Forest: added a looping, muted, autoplaying ambient `magic-fog`
  video layer (autoplay is fine here — it's muted background loop, not
  the audio ASSETS.md bans autoplaying) plus a non-pinned reveal-on-enter
  text timeline.
- `AudioToggle`: user-controlled, glass-styled floating button (one of
  DESIGN_SYSTEM.md's allowed glass use cases), mounted once at the root
  layout. Never autoplays; `play()`'s rejection is caught so a blocked
  play attempt just leaves the icon in its "off" state.
- `tsc --noEmit`, `eslint`, `next build` all pass clean.

**Problems:**
- Found and fixed a real stacking-order bug while wiring Hero's video: an
  absolutely-positioned sibling with default `z-index: auto` paints above
  static in-flow content regardless of DOM order (CSS stacking context
  rules), which would have put the video over the hero text. Same issue
  applied to Magical Forest's fog video.
- `SectionContainer`'s scrim was originally a flat dark overlay, which
  would have hurt contrast on `soft-white`-toned sections (Hero, Final
  CTA) where the foreground text is dark, not light.

**Solutions:**
- Wrapped each section's text content in its own `relative` div so it
  participates in the same stacking bucket as the video sibling, and
  wins by DOM order.
- Made the scrim tone-matched (`TONE[...].scrim`) instead of a single
  hardcoded dark overlay — dark scrim under light text, light scrim
  under dark text.

**Lessons Learned:**
- "Placeholder now, swap later" extends cleanly to media once there's a
  real, spec-defined filename to wire against with graceful fallback —
  the distinction from 3D placeholder geometry isn't "2D vs 3D," it's
  "does a safe, honest stand-in exist." For 3D, primitives are that
  stand-in. For media, the correct integration code pointed at the real
  path *is* the stand-in — inventing fake image/audio files would not be.

**Next Sprint:**
Phase 5 — Performance.

## 2026-07-24 — Sprint 3B & 3C

**Sprint:** 3B — Environment, 3C — Squirrel (combined; user asked to proceed
with placeholder geometry rather than stop-and-wait on real assets)

**Objective:**
Build the environment (tree/rock/ground, fog, lighting) and squirrel
character using placeholder primitive geometry, structured so a real-asset
swap later touches only the placeholder components themselves.

**Completed Work:**
- `environment/Tree.tsx`, `environment/Rock.tsx` — primitive stand-ins,
  each carrying a comment naming the exact `useGLTF("/models/...")` swap
  that replaces it.
- `environment/Ground.tsx` — a procedural plane; not one of ASSETS.md's
  three named models, so not slated for a GLB swap.
- `Squirrel.tsx` — primitive capsule/sphere/cone group with a `useFrame`-
  driven bob + head-turn standing in for real idle/look/tail animation
  clips.
- `SquirrelCanvas.tsx` — added fog, enabled shadow mapping, wired in all
  four new components.
- `tsc --noEmit`, `eslint`, `next build` all pass clean.

**Problems:**
- None of the three real GLB assets (`tree.glb`, `rock.glb`,
  `squirrel.glb`) exist in `public/models/`.

**Solutions:**
- Followed the explicit instruction to build with placeholder geometry now
  and swap later, rather than stopping. Each placeholder component is a
  single, isolated swap point — `SquirrelCanvas.tsx` itself needs no
  changes when real models arrive.

**Lessons Learned:**
- Keeping placeholder components 1:1 with their eventual real-asset
  counterpart (one component per model) makes "swap later" a literal
  file-content replacement instead of a re-wiring exercise.

**Next Sprint:**
Phase 4 — Media. Applying the same "placeholder now, swap later" approach
Where it holds up: 3D primitives are a meaningful stand-in for missing
geometry. Real photos/video/audio don't have an equivalent honest stand-in
beyond a flat color (already in place since Sprint 1B) — proceeding to
wire the actual integration code (next/image, scroll-scrubbed video,
audio toggle) against ASSETS.md's real filenames with graceful fallback,
rather than fabricating fake media files.

## 2026-07-24 — Sprint 3A

**Sprint:** 3A — R3F Foundation

**Objective:**
Install and configure React Three Fiber, isolated to `SquirrelScene`, with
a bare canvas and lighting rig — no environment/model content yet.

**Completed Work:**
- Installed `three@0.185.1`, `@react-three/fiber@9.6.1`, `@types/three`
  (both React 19-compatible).
- Added `SquirrelCanvas.tsx`: a `Canvas` with ambient + warm directional
  lighting, no geometry.
- `SquirrelScene.tsx` now lazy-mounts `SquirrelCanvas` via the existing
  `useInView` hook (already documented for exactly this use case since
  Sprint 1A), and dynamically imports it with `ssr: false` so
  `three`/`@react-three/fiber` never ship in the server bundle.
- `tsc --noEmit`, `eslint`, and `next build` all pass clean.

**Problems:**
- `npm install` surfaced 3 pre-existing high-severity `npm audit` findings
  (postcss/sharp) that trace through Next.js's own bundled dependencies,
  not through the packages just added.

**Solutions:**
- Left them alone — `npm audit fix --force` wants to downgrade Next.js to
  9.3.3, a breaking change with much larger blast radius than the
  advisories themselves. Logged in CHANGELOG as a known, pre-existing
  issue rather than silently "fixing" it into a regression.

**Lessons Learned:**
- `useInView`'s original docstring (Sprint 1A) already named "the R3F
  canvas" as a deferred-mount target — the infrastructure was built
  correctly ahead of time and needed zero changes to serve this sprint.

**Next Sprint:**
3B — Environment. Blocked on real assets: `ASSETS.md` specifies
Draco-compressed `tree.glb`/`rock.glb`, neither of which exist in
`public/models/` (currently only a `.gitkeep`). Will report this as a
stop condition rather than substituting placeholder primitive geometry
as if it were final content.

## 2026-07-24 — Sprint 2C

**Sprint:** 2C — Story & CTA Animations

**Objective:**
Extend the Sprint 2A reveal infrastructure to Story (short pin, text
reveal, fade in/out) and Final CTA (fade + upward motion reveal), and add
the primary button hover state both sections' specs assume exists.

**Completed Work:**
- `Story.tsx`: pinned, scrubbed timeline over `[data-title]`/
  `[data-description]` — staggered fade+up entrance, hold, fade+up exit.
  Pin track kept short (`+=40%`) per DESIGN_SYSTEM.md's rule that only
  Hero/Squirrel get extended pins.
- `FinalCTA.tsx`: non-pinned reveal-on-enter/reverse-on-exit timeline
  (headline → description → button group), reusing the `data-cta` wrapper
  convention from Hero.
- `Button.tsx`: added the primary-variant hover state (brightness, 1.02
  scale, soft shadow, no glow) that was explicitly flagged as deferred
  Phase 2 work in its own code comment. Scoped to `primary` only —
  DESIGN_SYSTEM.md doesn't specify a secondary hover treatment.
- `tsc --noEmit`, `eslint`, and `next build` all pass clean.
- Ran the `fewer-permission-prompts` skill against recent transcripts and
  added the one command that was both read-only and identical every run
  (`npx tsc --noEmit`) to `.claude/settings.json`. Declined to allowlist
  `npx eslint`/`npm run build` — wildcarding package runners is an
  arbitrary-code-execution risk, and their args vary run to run anyway.

**Problems:**
- ANIMATION.md's Story spec calls for "gentle image parallax," but Story
  has no image element — that arrives in Sprint 4A.

**Solutions:**
- Implemented everything else (text reveal, short pin, fade in/out) now;
  logged parallax as a Known Issue to pick up once the image exists,
  rather than inventing a placeholder image element ahead of schedule.

**Lessons Learned:**
- Reveal-on-enter sections (no pin) don't need the "read reduced-motion
  once at mount" workaround's complexity beyond skipping the whole
  ScrollTrigger — since there's no separate always-play entrance to
  preserve (unlike Hero), the reduced-motion branch can just bail out
  before any tween is created at all.

**Next Sprint:**
3A — R3F Foundation.

## 2026-07-24 — Sprint 2B

**Sprint:** 2B — Hero Animation

**Objective:**
Premium cinematic Hero entrance timeline plus a pinned/scrubbed
`ScrollTrigger` that prepares the section for a future background video.

**Completed Work:**
- Converted `HeroForest.tsx` to a client component using `useReveal`.
- Built a 4-step entrance timeline (section fade → headline fade+up →
  description fade+up → CTA fade) from `fadeIn`/`fadeInUp` in `lib/animation`.
- Added a wrapping div carrying the `useReveal` ref (no layout impact) so
  ScrollTrigger has a real element to pin without modifying the shared
  `SectionContainer` component.
- Wrapped the CTA button in a `data-cta` div (Button itself isn't ref-
  forwarding) so the timeline can target it without touching `Button.tsx`.
- Added a `pin: true, scrub: 1` `ScrollTrigger` via `scrollTriggerDefaults()`,
  skipped entirely under `prefers-reduced-motion`.
- Verified with `tsc --noEmit` and `eslint` — both clean. No browser tooling
  available this session to visually confirm; user asked to check
  `localhost:3000` manually.

**Problems:**
- `Button` doesn't forward refs, and modifying it or `SectionContainer` was
  out of this sprint's approved scope (Hero-only).

**Solutions:**
- Used a plain wrapping `<div data-cta>` around `Button` and a plain
  wrapping `<div ref={ref}>` around `SectionContainer`'s output instead of
  changing either shared component.

**Lessons Learned:**
- Kept the entrance timeline decoupled from the pin/scrub `ScrollTrigger`:
  the spec's 4-step sequence reads as a one-time load animation, while
  "scrub smoothly with scrolling" is about the *pin*, not the text reveal —
  conflating the two would have made hero copy invisible until the user
  started scrolling, which isn't the intended first impression.
- Reduced-motion is read once at mount rather than reactively, to avoid
  double-creating the timeline/ScrollTrigger if the OS preference changes
  mid-session — an edge case the brief didn't ask for.

**Next Sprint:**
2C — Story & CTA Animations.

## 2026-07-24 — Sprint 2A

**Sprint:** 2A — Motion Infrastructure

**Objective:**
Build a scalable animation foundation (utilities, hook, markup attributes)
without introducing any visible animation.

**Completed Work:**
- Reviewed existing `SmoothScrollProvider`, `useLenis`, `lib/gsap.ts`,
  `lib/lenis.ts` against current GSAP/Lenis best practice — no refactor
  needed, all already correct.
- Created `src/lib/animation/` (constants, easings, media, reveal, scroll,
  types, barrel, README).
- Created `hooks/useReveal.ts`.
- Added `SplitText` placeholder registration comment to `lib/gsap.ts`.
- Added `data-title` / `data-description` / `data-reveal` attributes to
  `SectionTitle` / `SectionDescription`.

**Problems:**
- None — infrastructure-only sprint with no section dependencies.

**Solutions:**
- N/A

**Lessons Learned:**
- Reveal factories are more useful returning `{ from, to }` tween-var pairs
  (for `fromTo()`) than a single vars object — lets reduced-motion collapse
  the `from` state to the resting state instead of branching call sites.

**Next Sprint:**
2B — Hero Animation (plan drafted, pending approval).
