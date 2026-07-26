"use client";

import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";
import { Ground, Rock, Tree } from "./environment";
import { Squirrel, type SquirrelBounds } from "./Squirrel";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface ScrollProgress {
  value: number;
}

export interface SquirrelCanvasProps {
  /** Mutable, not React state — SquirrelScene's ScrollTrigger writes to this
   * every scroll tick; reading it in useFrame avoids a React re-render per
   * scroll event (see requirement: avoid unnecessary re-renders). */
  progressRef: RefObject<ScrollProgress>;
}

/**
 * R3F mount, isolated to its own module so `three`/`@react-three/fiber`
 * never enter the server bundle (see the `dynamic(..., { ssr: false })`
 * import in SquirrelScene.tsx).
 */
export function SquirrelCanvas({ progressRef }: SquirrelCanvasProps) {
  const prefersReducedMotion = useReducedMotion();
  const [bounds, setBounds] = useState<SquirrelBounds | null>(null);
  const handleReady = useCallback((b: SquirrelBounds) => setBounds(b), []);

  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 2]}
      shadows="soft"
      gl={{ antialias: true }}
      camera={{ position: [0, 1.4, 4], fov: 45 }}
    >
      {/* Warm, golden-hour-leaning atmosphere per DESIGN_SYSTEM.md. */}
      <fog attach="fog" args={["#C8D0C8", 4, 12]} />

      {/* Fill: low ambient so shadowed faces never crush to pure black. */}
      <ambientLight intensity={0.3} color="#C8D0C8" />
      {/* Key: warm golden-hour sun, the primary shadow-casting light. */}
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.7}
        color="#D4A017"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      />
      {/* Fill: cool bounce light from the opposite side, no shadow of its
          own (avoids a second, competing shadow direction). */}
      <directionalLight position={[-3, 1.6, 1]} intensity={0.35} color="#C8D0C8" />
      {/* Rim: soft backlight separating the squirrel from the forest behind it. */}
      <directionalLight position={[-1.5, 2.4, -3]} intensity={0.85} color="#F7F7F2" />

      <Ground />
      <Tree />
      <Rock />
      <Suspense fallback={null}>
        <Squirrel onReady={handleReady} />
      </Suspense>

      <CameraRig progressRef={progressRef} bounds={bounds} prefersReducedMotion={prefersReducedMotion} />
      <Preload all />
    </Canvas>
  );
}

interface CameraRigProps {
  progressRef: RefObject<ScrollProgress>;
  bounds: SquirrelBounds | null;
  prefersReducedMotion: boolean;
}

/**
 * Scroll-driven camera dolly (Sprint 3D, pulled forward into this pass).
 * Three keyframes — wide establishing, orbiting in, close hero framing —
 * derived from the squirrel's actual rendered bounds rather than hardcoded
 * numbers, so the framing stays correct if TARGET_HEIGHT in Squirrel.tsx
 * ever changes. No user-controlled orbit — position is a pure function of
 * scroll progress, per ANIMATION.md.
 */
function CameraRig({ progressRef, bounds, prefersReducedMotion }: CameraRigProps) {
  const { camera } = useThree();
  const dampedProgress = useRef(0);
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpLook = useMemo(() => new THREE.Vector3(), []);

  const keyframes = useMemo(() => {
    if (!bounds) return null;
    const { center, size } = bounds;
    const radius = Math.max(size.x, size.z) * 0.5 + size.y;
    const distance = Math.max(radius * 3.2, 1.6);

    return [
      {
        pos: new THREE.Vector3(center.x + distance * 0.7, center.y + size.y * 1.6, center.z + distance * 1.1),
        look: center.clone(),
      },
      {
        pos: new THREE.Vector3(center.x - distance * 0.35, center.y + size.y * 0.9, center.z + distance * 0.55),
        look: center.clone().add(new THREE.Vector3(0, size.y * 0.15, 0)),
      },
      {
        pos: new THREE.Vector3(center.x + distance * 0.12, center.y + size.y * 0.55, center.z + distance * 0.32),
        look: center.clone().add(new THREE.Vector3(0, size.y * 0.25, 0)),
      },
    ];
  }, [bounds]);

  useFrame((_, delta) => {
    if (!keyframes) return;

    const target = prefersReducedMotion ? 0 : progressRef.current.value;
    dampedProgress.current = THREE.MathUtils.damp(dampedProgress.current, target, 6, delta);

    const p = dampedProgress.current * (keyframes.length - 1);
    const i = THREE.MathUtils.clamp(Math.floor(p), 0, keyframes.length - 2);
    const localT = p - i;

    tmpPos.lerpVectors(keyframes[i].pos, keyframes[i + 1].pos, localT);
    tmpLook.lerpVectors(keyframes[i].look, keyframes[i + 1].look, localT);

    camera.position.copy(tmpPos);
    camera.lookAt(tmpLook);
  });

  return null;
}
