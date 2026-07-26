# 🌲 Forest Website — Development Roadmap

Status legend: `[x]` complete · `[~]` in progress · `[ ]` not started.

This roadmap is the source of truth for sprint sequencing. Each sprint's
detailed brief lives in `prompts/sprint-<id>.md`; its outcome is recorded in
`DEVLOG.md`; user-facing changes land in `CHANGELOG.md`.

---

## Phase 0 — Planning

### Sprint 0 — Planning
- [x] **Status**

**Goal:** Establish project vision, design system, asset spec, and animation
guidelines before any code is written.

**Deliverables:** `PROJECT.md`, `DESIGN_SYSTEM.md`, `ASSETS.md`, `ANIMATION.md`,
`CLAUDE.md` workflow rules.

**Exit Criteria:** All four reference docs exist and are internally
consistent; tech stack and workflow rules are agreed.

---

## Phase 1 — Static Foundation

### Sprint 1A — Foundation
- [x] **Status**

**Goal:** Stand up the Next.js app shell and core infrastructure primitives.

**Deliverables:** App Router layout, Tailwind setup, `lib/cn.ts`, `lib/gsap.ts`,
`lib/lenis.ts`, `SmoothScrollProvider`, `useLenis`, `useReducedMotion`, `useInView`.

**Exit Criteria:** App boots, smooth scroll active, reduced-motion detection
working, no section content yet.

### Sprint 1B — Static Sections
- [x] **Status**

**Goal:** Build all seven sections as static, unanimated, responsive layout.

**Deliverables:** `LoadingScreen`, `HeroForest`, `Story`, `SquirrelScene`,
`MagicalForest`, `FinalCTA`, `Footer`, plus shared `SectionContainer`,
`Container`, `SectionTitle`, `SectionDescription`, `Button`.

**Exit Criteria:** Every section renders with placeholder copy/backgrounds,
correct semantic structure (`data-section`, heading hierarchy, `aria-labelledby`).

### Sprint 1C — Polish
- [x] **Status**

**Goal:** Responsive and visual pass across all static sections.

**Deliverables:** Spacing/typography consistency against `DESIGN_SYSTEM.md`,
mobile/tablet/desktop breakpoints verified.

**Exit Criteria:** Static skeleton matches design system on all target
breakpoints with no animation yet.

---

## Phase 2 — Non-3D Animation

### Sprint 2A — Motion Infrastructure
- [x] **Status**

**Goal:** Build the reusable animation foundation without any visible motion.

**Deliverables:** `lib/animation/` (`constants`, `easings`, `media`, `reveal`,
`scroll`, `types`, barrel, `README.md`), `hooks/useReveal.ts`, `data-title` /
`data-description` / `data-reveal` attributes, `SplitText` placeholder in
`lib/gsap.ts`.

**Exit Criteria:** Utilities type-check and lint clean; zero visible animation
change; documented usage pattern for future sections.

### Sprint 2B — Hero Animation
- [x] **Status**

**Goal:** Premium cinematic Hero timeline (fade/translate reveal of headline,
description, CTA) with a pinned, scrubbed `ScrollTrigger`.

**Deliverables:** Hero timeline built from `lib/animation` factories, pinned
scroll track prepared for future background video, reduced-motion fallback.

**Exit Criteria:** Hero animates on scroll, respects `prefers-reduced-motion`,
no other section touched.

### Sprint 2C — Story & CTA Animations
- [x] **Status**

**Goal:** Extend the reveal infrastructure to Story (text reveal, gentle
parallax, short pin) and Final CTA (fade + upward motion, button hover state).

**Deliverables:** Timelines in `Story.tsx` and `FinalCTA.tsx` only.

**Exit Criteria:** Both sections animate per `ANIMATION.md`; no shared infra
changes required beyond what 2A already provides.

---

## Phase 3 — Signature 3D Squirrel Scene

### Sprint 3A — R3F Foundation
- [x] **Status**

**Goal:** Install and configure React Three Fiber inside `SquirrelScene` only.

**Deliverables:** Canvas mount, lazy-mount via `useInView`, base lighting rig.

**Exit Criteria:** Empty R3F canvas renders in place without regressing other
sections' performance.

### Sprint 3B — Environment
- [~] **Status** (placeholder geometry — real GLBs pending)

**Goal:** Load tree, rock, and ground geometry into the scene.

**Deliverables:** Draco-compressed GLB loading, environment lighting/fog.

**Exit Criteria:** Static environment renders at target frame rate on
mid-tier hardware.

### Sprint 3C — Squirrel
- [~] **Status** (placeholder geometry — real GLB pending)

**Goal:** Add the squirrel model with idle/look/tail animation states.

**Deliverables:** Squirrel GLB integration, animation mixer, idle loop.

**Exit Criteria:** Squirrel animates convincingly at rest, no user-triggered
interactions beyond scroll.

### Sprint 3D — Camera
- [ ] **Status**

**Goal:** Scroll-driven camera dolly along a predefined path.

**Deliverables:** ScrollTrigger-linked camera path, pinned scene section.

**Exit Criteria:** Camera moves smoothly with scroll; no user-controlled
orbit camera exists.

### Sprint 3E — Optimization
- [ ] **Status**

**Goal:** Profile and optimize the 3D scene.

**Deliverables:** Draw-call/texture audit, low-end fallback (static image or
video) behind `prefers-reduced-motion` / capability detection.

**Exit Criteria:** Scene holds target frame budget on reference hardware;
graceful degradation path verified.

---

## Phase 4 — Media Integration

### Sprint 4A — Images
- [~] **Status** (integration wired to real filenames — files pending)

**Goal:** Replace placeholder images with final AVIF/WebP assets per `ASSETS.md`.

**Deliverables:** Optimized, responsive `next/image` usage across sections.

**Exit Criteria:** All section imagery matches asset spec, correctly sized
and lazy-loaded.

### Sprint 4B — Video
- [~] **Status** (integration wired to real filenames — files pending)

**Goal:** Wire the Hero cinematic and Magical Fog loop videos into their
prepared scroll tracks.

**Deliverables:** WebM/MP4 scroll-scrubbed video in Hero, looping background
video in Magical Forest.

**Exit Criteria:** Video playback is scroll-synced (Hero) or seamlessly
looping (Magical Forest), compressed per spec, no audio track.

### Sprint 4C — Audio
- [~] **Status** (toggle + wiring complete — file pending)

**Goal:** Add optional, user-controlled forest ambience.

**Deliverables:** Audio toggle control, `forest-ambient.mp3`, never autoplay.

**Exit Criteria:** Audio only plays after explicit user action; toggle is
accessible and glass-styled per `DESIGN_SYSTEM.md`.

---

## Phase 5 — Performance

### Sprint 5A — Performance
- [x] **Status**

**Goal:** General performance pass across the full site.

**Deliverables:** Bundle analysis, code-splitting review, asset lazy-load
verification.

**Exit Criteria:** No obvious performance regressions; measurable baseline
recorded.

### Sprint 5B — Lighthouse Optimization
- [x] **Status** (90+ hit on all categories, desktop and mobile)

**Goal:** Close the gap to Lighthouse 90+ across all categories.

**Deliverables:** Targeted fixes from Lighthouse findings (CLS, LCP, TBT, etc.).

**Exit Criteria:** Lighthouse scores 90+ on Performance, Accessibility, Best
Practices, SEO (mobile and desktop).

### Sprint 5C — Performance Audit
- [~] **Status** (Lighthouse-verified; no physical device farm available for manual scroll-jank profiling)

**Goal:** Final scroll-jank and frame-budget audit across sections and devices.

**Deliverables:** Profiling notes, any remaining fixes.

**Exit Criteria:** Smooth scroll and animation on reference low/mid/high-end
devices.

---

## Phase 6 — Quality

### Sprint 6A — SEO
- [x] **Status**

**Goal:** Metadata, structured data, sitemap, and social sharing pass.

**Deliverables:** `next/metadata` completeness, Open Graph/Twitter cards,
`sitemap.xml`, `robots.txt`.

**Exit Criteria:** SEO Lighthouse category 90+; social previews render correctly.

### Sprint 6B — Accessibility
- [~] **Status** (Lighthouse 100 + skip link; no assistive-tech device for a manual screen-reader walkthrough)

**Goal:** Full accessibility pass beyond reduced-motion.

**Deliverables:** Keyboard navigation audit, focus states, contrast checks,
screen-reader pass.

**Exit Criteria:** Accessibility Lighthouse category 90+; manual keyboard/SR
walkthrough passes.

### Sprint 6C — Cross Browser Testing
- [~] **Status** (code-level review only; no real browser/device matrix available)

**Goal:** Verify behavior across major browsers/devices.

**Deliverables:** Test matrix results (Chrome, Safari, Firefox, Edge, iOS
Safari, Android Chrome).

**Exit Criteria:** No visual or functional regressions on any tested target.

---

## Phase 7 — Launch

### Sprint 7A — Deployment
- [ ] **Status**

**Goal:** Production deployment pipeline.

**Deliverables:** Hosting configuration, environment variables, build
verification.

**Exit Criteria:** Production build deploys successfully and matches staging.

### Sprint 7B — Monitoring
- [ ] **Status**

**Goal:** Observability for the live site.

**Deliverables:** Error tracking, performance monitoring, uptime checks.

**Exit Criteria:** Alerts configured and verified with a test event.

### Sprint 7C — Release
- [ ] **Status**

**Goal:** Final launch.

**Deliverables:** Release notes, `CHANGELOG.md` v1.0.0 entry, go-live checklist.

**Exit Criteria:** Site live at production domain; roadmap Phases 0–7 marked
complete.

---

## Phase 8 — Portfolio
- [ ] **Status**

**Goal:** Package the project as a portfolio case study.

**Deliverables:** Case study writeup, before/after visuals, technical
highlights summary.

**Exit Criteria:** Portfolio-ready presentation of the project exists
independent of the live site.

---

## Phase 9 — Enterprise Enhancements
- [ ] **Status**

**Goal:** Evaluate and scope enhancements beyond v1 scope (see `PROJECT.md` →
Out of Scope).

**Deliverables:** Scoping document for any of: CMS integration, multi-locale
support, analytics/experimentation, expanded 3D content.

**Exit Criteria:** Enhancements are explicitly scoped and approved before any
implementation begins — none are implied or assumed by this roadmap.
