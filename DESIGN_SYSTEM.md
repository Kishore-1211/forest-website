# 🎨 Forest Website — Design System

## Design Philosophy

The design should feel:

- Premium
- Minimal
- Cinematic
- Calm
- Natural
- Timeless

Inspired by:

- Apple
- Awwwards-winning websites
- Luxury outdoor brands
- Nature documentaries

Avoid anything flashy, overly colorful, or game-like.

---

# Visual Theme

Primary Theme

Living Forest at Golden Hour

Light filters through trees.

Soft fog fills the distance.

Warm sunlight creates contrast.

The environment feels alive but peaceful.

---

# Color Palette

## Primary

Forest Green
#1F4D36

Deep Forest
#163020

Moss
#6B8E23

Warm Gold
#D4A017

Soft White
#F7F7F2

Charcoal
#1B1B1B

Fog Gray
#C8D0C8

Avoid highly saturated colors.

---

# Typography

Headings

Style:
Elegant
Large
Minimal

Weight:
700

Body

Readable

Comfortable spacing

Weight:
400–500

Never use decorative fonts.

---

# Spacing System

Use an 8px spacing scale.

Examples:

8px

16px

24px

32px

48px

64px

96px

128px

Avoid random spacing values.

---

# Border Radius

Cards

20px

Buttons

9999px (pill)

Images

16px

---

# Shadows

Very subtle.

Large soft shadows.

Never harsh black shadows.

---

# Glass Effects

Allowed only for:

Navigation

Floating controls

Audio toggle

Use low opacity with background blur.

Avoid glass everywhere.

---

# Buttons

Primary Button

Rounded pill

Hover state: slight brightness increase, scale 1.02–1.03, soft shadow enhancement, smooth transition.

No glow effects of any kind.

Secondary Button

Minimal outline

---

# Icons

Simple

Minimal

Thin strokes

Consistent size

---

# Animation Principles

Animations should feel:

Slow

Natural

Purposeful

Never bouncy.

Never exaggerated.

---

# Motion Timing

Fast

0.25s

Normal

0.5s

Large transitions

0.8–1.2s

Scene transitions

Controlled by scroll.

---

# Scroll Behavior

Smooth scrolling.

No sudden jumps.

No unnecessary scroll hijacking.

The user should feel like they are walking through the forest.

---

# Section Layout

Each section occupies approximately one viewport height, visually.

Visual height and scroll distance are different things. A section can stay visually fixed (pinned) while the scroll track underneath it runs for multiple viewport heights — the visitor sees one steady frame but has more scroll distance to move through it slowly. This is intentional in premium cinematic scrolling (see `ANIMATION.md` → Scroll Rules) and is used specifically for Hero Forest and the Signature 3D Squirrel Scene.

Every other section keeps scroll distance close to its visual height — one viewport, no extended pin.

Content should have generous breathing space.

Avoid clutter.

---

# Responsive Design

Desktop First

Tablet optimized

Mobile fully supported

Animations should degrade gracefully on low-end devices.

---

# Accessibility

Respect prefers-reduced-motion.

Maintain readable contrast.

Keyboard navigation should work.

Interactive elements must have visible focus states.

---

# Overall Rule

Whenever there is a choice between:

Fancy vs Elegant

Choose Elegant.

Complex vs Simple

Choose Simple.

More Effects vs Better Experience

Choose Better Experience.