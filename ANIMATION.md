# 🎬 Forest Website — Animation Guidelines

## Animation Philosophy

Animation should support storytelling.

Never animate something just because it can be animated.

The user should feel like they are walking through a living forest.

Motion should feel cinematic, calm, and natural.

---

# Animation Principles

Every animation should be:

- Smooth
- Purposeful
- Minimal
- High performance

Avoid:

- Bouncy animations
- Flashy effects
- Constant motion
- Distracting transitions

---

# Global Motion Rules

Use:

- Lenis for smooth scrolling
- GSAP for UI animations
- ScrollTrigger for scroll-driven timelines
- React Three Fiber only for the Signature 3D Scene

---

# Loading Screen

Goal

Build anticipation.

Animation

- Logo fade in
- Progress indicator
- Smooth fade into Hero

Duration

1.5–2.5 seconds

---

# Hero Section

Goal

Create a strong first impression.

Animations

- Scroll-scrubbed hero video
- Headline fades in
- Text moves slightly upward
- Background reacts to scroll

Avoid over-animating.

---

# Story Section

Goal

Slow the pace.

Animations

- Text reveal
- Gentle image parallax
- Short section pin
- Fade in and fade out

---

# Signature 3D Squirrel Scene

Goal

Deliver the only major "wow" moment.

Animations

- Camera follows a predefined scroll path
- Squirrel idle animation
- Tail movement
- Slight head movement
- Floating particles
- Soft fog movement

No user-controlled orbit camera.

---

# Magical Forest

Goal

Transition from excitement to calm.

Animations

- Light rays fade in
- Fog drifts slowly
- Background image parallax
- Gentle text reveal

---

# Final CTA

Goal

Encourage action.

Animations

- Fade in
- Slight upward motion
- Button hover: brightness increase, scale 1.02–1.03, soft shadow enhancement, smooth transition
- No glow effects

Keep it subtle.

---

# Footer

Goal

Quiet ending.

Animations

- Simple hover effects only

---

# Motion Timing

Small interactions

200–300ms

Standard animations

500–800ms

Large reveals

800–1200ms

Scroll animations

Controlled by ScrollTrigger

---

# Easing

Prefer:

- easeOut
- power2.out
- power3.out

Avoid:

- bounce
- elastic
- exaggerated spring animations

---

# Scroll Rules

Scrolling should feel continuous.

Avoid sudden jumps.

Avoid excessive pinning.

Only pin sections where it improves storytelling.

Visual section height and scroll distance are different concepts. Most sections occupy roughly one viewport height for both. Hero Forest and the Signature 3D Squirrel Scene are the exception: both use ScrollTrigger pinning, so they stay visually fixed while their underlying scroll track runs for multiple viewport heights. That extra track is what gives the video scrub and the camera dolly room to play out slowly instead of resolving in a single scroll gesture — an intentional pacing choice, not a bug.

---

# Performance Rules

Animations must maintain smooth performance.

Prefer transform and opacity.

Avoid animating expensive layout properties.

Lazy-load heavy animation assets.

Respect prefers-reduced-motion.

---

# Definition of Good Animation

A visitor should notice the experience,

not the animation itself.

If an animation attracts attention to itself,

it is probably too much.