# Code Review Checklist

Run through the relevant categories before marking a sprint complete. Not
every category applies to every sprint — skip what doesn't apply rather than
checking it off blindly.

## Architecture

- [ ] Change stays within the files listed in the sprint's `Files Modified`
- [ ] No duplicate logic introduced where a shared utility already exists
- [ ] New abstractions are justified by actual (not hypothetical) reuse
- [ ] Section-specific logic stays in `src/sections/`, not leaked into
      shared `lib/`/`hooks/`
- [ ] Plugin registration stays centralized in `lib/gsap.ts`

## Code Quality

- [ ] Code is readable without needing the sprint brief open
- [ ] No dead code, commented-out blocks, or leftover debug logging
- [ ] Naming is consistent with existing conventions in the touched folder
- [ ] No unused imports, variables, or props

## Accessibility

- [ ] `prefers-reduced-motion` is respected for any new animation
- [ ] Interactive elements have visible focus states
- [ ] Color contrast meets DESIGN_SYSTEM.md expectations
- [ ] Heading hierarchy and `aria-labelledby` wiring stay intact
- [ ] Keyboard-only navigation still works end to end

## Performance

- [ ] Animations use `transform`/`opacity` only, not layout properties
- [ ] No duplicate `ScrollTrigger`s created on remount
- [ ] `gsap.context()` cleanup runs on unmount (no leaked tweens/triggers)
- [ ] Heavy assets are lazy-loaded/lazy-mounted where applicable
- [ ] No unnecessary re-renders introduced

## Responsiveness

- [ ] Verified at mobile, tablet, and desktop breakpoints
- [ ] No horizontal overflow introduced
- [ ] Touch targets remain usable on mobile

## Animations

- [ ] Only approved easings used (`power2.out`, `power3.out`)
- [ ] Timing matches ANIMATION.md's motion-timing scale
- [ ] No bounce/elastic/exaggerated motion
- [ ] Animation supports storytelling, not decoration for its own sake

## TypeScript

- [ ] `tsc --noEmit` passes with no new errors
- [ ] No `any` introduced without a documented reason
- [ ] Shared types come from `lib/animation/types.ts` where applicable

## Tailwind

- [ ] Spacing values come from the 8px scale in DESIGN_SYSTEM.md
- [ ] No arbitrary one-off values where a token already exists
- [ ] `cn()` used instead of manual string concatenation for conditional classes

## Documentation

- [ ] `CHANGELOG.md` updated under `[Unreleased]`
- [ ] `DEVLOG.md` entry added for the sprint
- [ ] `ROADMAP.md` status checkbox updated
- [ ] Non-obvious decisions captured as code comments only where the WHY
      isn't already obvious from the code

## Testing

- [ ] `npx eslint` passes clean on touched files
- [ ] `npx tsc --noEmit` passes clean
- [ ] Feature manually exercised in a browser (not just type-checked)
- [ ] Reduced-motion toggle tested where animation was added

## SEO

- [ ] No regressions to metadata, heading structure, or semantic HTML
- [ ] Images have meaningful `alt` text

## Deployment Readiness

- [ ] No new environment variables left undocumented
- [ ] No new dependencies added without prior approval
- [ ] Build (`next build`) succeeds locally
