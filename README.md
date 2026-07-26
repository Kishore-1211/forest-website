# 🌲 Forest Website

A premium, cinematic, scroll-driven website inspired by Apple product pages
and Awwwards-winning experiences. The visitor scrolls through a living
forest as one continuous journey rather than a series of independent
sections.

## Project Overview

See [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) for the full requirements
document. In short: seven sections (Loading Screen, Hero Forest, Story,
Signature 3D Squirrel Scene, Magical Forest, Final CTA, Footer) form a
single scroll-driven narrative, with one real-time 3D "wow moment" at its
center.

## Vision

The visitor should feel like they are walking through a magical forest.
Every scroll reveals something new. Animation supports storytelling — it is
never decoration for its own sake. The experience should feel calm, premium,
and cinematic throughout.

Emotional arc: **Arrival → Curiosity → Wonder → Immersion → Calm → Resolution**.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router) |
| UI | React + TypeScript |
| Styling | Tailwind CSS |
| Smooth scroll | Lenis |
| Animation | GSAP + ScrollTrigger |
| 3D | React Three Fiber (Signature Squirrel Scene only) |

No additional libraries are added without explicit approval — see `CLAUDE.md`.

## Architecture

- **Smooth scroll** is driven once, globally, by `SmoothScrollProvider` →
  `useLenis`, which syncs Lenis into GSAP's ticker so every `ScrollTrigger`
  stays in lockstep with smoothed scroll position.
- **All GSAP plugin registration is centralized** in `src/lib/gsap.ts` —
  never registered ad hoc in a component.
- **Shared animation utilities** live in `src/lib/animation/` (durations,
  approved easings, reduced-motion helpers, reveal tween factories,
  ScrollTrigger defaults). Section timelines are built *from* these, never
  duplicated by hand. See `src/lib/animation/README.md` for the full pattern.
- **`prefers-reduced-motion`** is respected everywhere motion is added —
  both via the `useReducedMotion` hook (for component logic) and
  `prefersReducedMotion()` (for plain GSAP code).
- **Section-specific timelines** live inside each section's own component
  under `src/sections/`, and only there.
- **The 3D scene is isolated** to `src/sections/SquirrelScene/` — React
  Three Fiber is never mounted elsewhere.

## Folder Structure

```
src/
├── app/                  # Next.js App Router entry (layout, page, globals.css)
├── components/
│   ├── common/
│   ├── layout/           # Container, SectionContainer
│   ├── providers/        # SmoothScrollProvider
│   └── ui/               # Button, SectionTitle, SectionDescription
├── hooks/                # useLenis, useReducedMotion, useInView, useReveal
├── lib/
│   ├── animation/        # Shared animation utilities (see its README.md)
│   ├── cn.ts
│   ├── gsap.ts           # Single source of plugin registration
│   └── lenis.ts
├── sections/             # One folder per page section, each self-contained
└── styles/

docs/                     # Project requirements, roadmap, changelog, devlog
prompts/                  # Per-sprint implementation prompt briefs
public/                   # Images, video, models, audio
```

## Development Workflow

This project follows a strict per-feature workflow (full detail in
[`CLAUDE.md`](CLAUDE.md)):

1. Analyze the request.
2. Review `docs/REQUIREMENTS.md`, `DESIGN_SYSTEM.md`, `ASSETS.md`, `ANIMATION.md`.
3. Explain the implementation plan and list every file to be touched.
4. Wait for explicit approval before writing any code.
5. Implement only the approved scope.
6. Record the outcome: update `docs/CHANGELOG.md`, add a `docs/DEVLOG.md`
   entry, tick the sprint's box in `docs/ROADMAP.md`.

Each sprint is scoped using [`docs/SPRINT_TEMPLATE.md`](docs/SPRINT_TEMPLATE.md)
and reviewed against [`docs/CODE_REVIEW_CHECKLIST.md`](docs/CODE_REVIEW_CHECKLIST.md)
before being marked complete. Sprint prompt briefs live in `prompts/`.

## Sprint Roadmap

Full detail in [`docs/ROADMAP.md`](docs/ROADMAP.md). Summary:

| Phase | Sprints | Focus |
| --- | --- | --- |
| 0 | Sprint 0 | Planning |
| 1 | 1A–1C | Static foundation |
| 2 | 2A–2C | Non-3D animation |
| 3 | 3A–3E | Signature 3D Squirrel Scene |
| 4 | 4A–4C | Media integration (images, video, audio) |
| 5 | 5A–5C | Performance |
| 6 | 6A–6C | SEO, accessibility, cross-browser QA |
| 7 | 7A–7C | Deployment, monitoring, release |
| 8 | — | Portfolio packaging |
| 9 | — | Enterprise enhancements (scoped, not assumed) |

## How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Future Enhancements

Deliberately out of scope for v1 (see `docs/REQUIREMENTS.md` → Out of Scope):
user authentication, CMS integration, backend services, dashboards, user
accounts, complex particle systems, multiple 3D scenes, multiplayer/game
mechanics. Any of these would be scoped under Phase 9 — Enterprise
Enhancements, and only pursued with explicit approval.

## License

Private project — no license granted for reuse.
