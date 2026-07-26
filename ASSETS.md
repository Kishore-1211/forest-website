# 🌲 Forest Website — Asset Specification

## Asset Philosophy

Every asset must support the story.

Quality is more important than quantity.

Use photorealistic assets.

Avoid cartoon, fantasy, low-poly, or stylized visuals.

All assets should feel like they belong to the same forest.

---

# Images

## 1. Hero Background

Purpose

Opening impression.

Style

Golden hour forest.

Sunlight through trees.

Soft fog.

Ultra realistic.

Orientation

Landscape

Format

AVIF/WebP

---

## 2. Story Image

Purpose

Support the narrative.

Style

Walking path through a peaceful forest.

Natural composition.

Minimal distractions.

---

## 3. Magical Forest

Purpose

Create wonder after the 3D section.

Style

Light rays.

Floating particles.

Soft mist.

Warm atmosphere.

---

## 4. CTA Background

Purpose

End the journey.

Style

Forest opening.

Bright.

Hopeful.

Inviting.

---

# Videos

## 1. Hero Cinematic

Purpose

Scroll-controlled opening sequence.

Length

6–8 seconds.

Camera

Slow forward movement.

Motion

Gentle.

No sudden changes.

Environment

Golden hour.

Fog.

Leaves moving slightly.

Loop

Yes.

---

## 2. Magical Fog Loop

Purpose

Background atmosphere.

Length

5–6 seconds.

Camera

Almost static.

Motion

Soft fog.

Light rays.

Floating dust.

Loop

Perfectly seamless.

---

# 3D Models

## 1. Squirrel

Purpose

Main character.

Style

Photorealistic.

Pose

Neutral.

Animation

Idle.

Look around.

Small head movement.

Tail movement.

Format

GLB

---

## 2. Tree

Purpose

Centerpiece of the 3D scene.

Style

Old forest tree.

Detailed bark.

Visible roots.

---

## 3. Rock

Purpose

Environmental detail.

Style

Natural.

Weathered.

Medium size.

---

# Audio

## Forest Ambience

Purpose

Optional immersion.

Contains

Wind

Birds

Leaves

No music.

Loop

Yes.

Volume

Very soft.

User controlled.

Never autoplay.

---

# Asset Quality Rules

Images

4K source preferred.

Export optimized.

Videos

Compressed.

No audio.

Loop cleanly.

Models

Low-poly geometry, optimized for real-time rendering. "Low-poly" refers only to triangle/vertex budget — it does not mean reduced visual quality. Visual realism comes from textures, lighting, and materials, not polygon count.

High-quality textures.

Draco compressed.

---

# Format Standards

Images

Primary: AVIF

Fallback: WebP

Videos

Primary: WebM

Fallback: MP4

Models

GLB

Audio

MP3

Fallback formats exist for browser compatibility. Not every browser supports AVIF or WebM, so every image and video ships with its fallback alongside it.

---

# Naming Convention

Images

hero-bg.avif / hero-bg.webp

story.avif / story.webp

magic.avif / magic.webp

cta-bg.avif / cta-bg.webp

Videos

hero-cinematic.webm / hero-cinematic.mp4

magic-fog.webm / magic-fog.mp4

Models

squirrel.glb

tree.glb

rock.glb

Audio

forest-ambient.mp3