"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const MODEL_PATH = "/models/squirrel.glb";

/** Scaled to sit naturally against the placeholder Tree/Rock's existing proportions. */
const TARGET_HEIGHT = 0.62;

/**
 * Which end of the model's dominant (longest) local axis the tail sits on.
 * The GLB has no named nodes/bones to key off of, so this was determined by
 * visual inspection in-browser rather than guessed from geometry alone —
 * flip to -1 if a future re-export puts the tail at the opposite end.
 */
const TAIL_SIGN = 1;
/** Local-space sway amplitude, tuned small so it reads as "gentle." */
const TAIL_SWAY_AMPLITUDE = 0.045;

export interface SquirrelBounds {
  /** World-space center of the model, including its ground position. */
  center: THREE.Vector3;
  /** World-space size (post scale-to-fit). */
  size: THREE.Vector3;
}

interface SquirrelProps {
  position?: [number, number, number];
  onReady?: (bounds: SquirrelBounds) => void;
}

/**
 * Loads the real squirrel.glb: centers it on X/Z, sits it on y=0, and scales
 * it to TARGET_HEIGHT regardless of the source model's native units. The GLB
 * ships with no animation clips (single static mesh, no skeleton — see
 * DEVLOG), so the idle motion below is procedural: a whole-body breathing
 * scale-pulse, a slow yaw as a "look around" proxy (no separate head node to
 * rotate independently), and a per-vertex tail bend injected into the
 * material's shader (no bones to drive a real tail joint).
 */
export function Squirrel({ position = [-0.6, 0, 1], onReady }: SquirrelProps) {
  const outerRef = useRef<Group>(null);
  const breathRef = useRef<Group>(null);
  const animRef = useRef<Group>(null);

  // Meshopt decoder — see the note in environment/Rock.tsx.
  const { scene, animations } = useGLTF(MODEL_PATH, false, true);
  const { actions } = useAnimations(animations, animRef);
  const prefersReducedMotion = useReducedMotion();

  const tailUniforms = useRef<{ value: number }[]>([]);

  // Fit metrics computed once from the loaded (cached, shared) scene — this
  // is the only Squirrel instance on the page, so mutating the cached scene
  // directly (below) is safe and avoids cloning geometry/materials/textures
  // that would just sit unused after the fit is applied.
  const { scale, offset, size } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const boxSize = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(boxSize);
    box.getCenter(center);
    const fitScale = boxSize.y > 0 ? TARGET_HEIGHT / boxSize.y : 1;
    return {
      scale: fitScale,
      offset: new THREE.Vector3(-center.x, -box.min.y, -center.z),
      size: boxSize,
    };
  }, [scene]);

  // Shadows, color space, and the tail-sway shader — all idempotent, so
  // running this again on remount/HMR is harmless.
  useEffect(() => {
    tailUniforms.current = [];

    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        const std = material as THREE.MeshStandardMaterial;
        if (std.map) std.map.colorSpace = THREE.SRGBColorSpace;

        mesh.geometry.computeBoundingBox();
        const bb = mesh.geometry.boundingBox;
        if (!bb) return;

        const dx = bb.max.x - bb.min.x;
        const dy = bb.max.y - bb.min.y;
        const dz = bb.max.z - bb.min.z;
        const longest = Math.max(dx, dy, dz);
        const axis = longest === dz ? "z" : longest === dx ? "x" : "y";
        const axisMin = bb.min[axis];
        const axisRange = Math.max(bb.max[axis] - axisMin, 1e-6);

        std.onBeforeCompile = (shader) => {
          shader.uniforms.uTime = { value: 0 };
          shader.uniforms.uSway = { value: TAIL_SWAY_AMPLITUDE };
          tailUniforms.current.push(shader.uniforms.uTime);

          shader.vertexShader =
            `uniform float uTime;\nuniform float uSway;\n` + shader.vertexShader;
          shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
            float tailAxisT = clamp((position.${axis} - ${axisMin.toFixed(5)}) / ${axisRange.toFixed(5)}, 0.0, 1.0);
            float tailWeight = smoothstep(0.55, 1.0, ${TAIL_SIGN > 0 ? "tailAxisT" : "1.0 - tailAxisT"});
            float tailSway = sin(uTime * 1.6) * uSway * tailWeight;
            transformed.x += tailSway;
            transformed.y += sin(uTime * 1.6 + 1.0) * uSway * 0.35 * tailWeight;`,
          );
        };
        std.needsUpdate = true;
      });
    });
  }, [scene]);

  // Play the primary embedded clip if the asset ever ships one; otherwise
  // the procedural idle below carries the motion.
  useEffect(() => {
    if (animations.length === 0) return;
    const primary = actions[animations[0].name];
    primary?.reset().fadeIn(0.4).play();
    return () => {
      primary?.fadeOut(0.2);
    };
  }, [actions, animations]);

  // Bounds only ever change if `position`/the fit metrics change, which they
  // don't after the initial load — read once, matching the reduced-motion
  // read-once pattern used elsewhere in this codebase (see HeroForest.tsx).
  useEffect(() => {
    onReady?.({
      center: new THREE.Vector3(position[0], position[1] + (size.y * scale) / 2, position[2]),
      size: new THREE.Vector3(size.x * scale, size.y * scale, size.z * scale),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasProceduralIdle = animations.length === 0;

  useFrame(({ clock }) => {
    if (prefersReducedMotion) return;

    const t = clock.getElapsedTime();

    tailUniforms.current.forEach((uniform) => {
      uniform.value = t;
    });

    if (!hasProceduralIdle) return;

    if (breathRef.current) {
      const breath = 1 + Math.sin(t * 1.2) * 0.012;
      breathRef.current.scale.set(breath, 1 + Math.sin(t * 1.2) * 0.016, breath);
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = Math.sin(t * 0.35) * 0.06;
    }
  });

  return (
    <group ref={outerRef} position={position}>
      <group ref={breathRef}>
        <group ref={animRef} position={offset} scale={scale}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATH, false, true);
