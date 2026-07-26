"use client";

/**
 * PLACEHOLDER GEOMETRY — stands in for ASSETS.md's `tree.glb` (Draco-
 * compressed, photorealistic bark/roots, centerpiece of the scene). Swap
 * this component's body for a `useGLTF("/models/tree.glb")` result once
 * that file exists in `public/models/` — nothing outside this file
 * (SquirrelCanvas.tsx, the environment barrel) needs to change.
 */
export function Tree() {
  return (
    <group position={[0, 0, -0.5]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.8, 8]} />
        <meshStandardMaterial color="#5C4033" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow>
        <coneGeometry args={[1, 1.6, 8]} />
        <meshStandardMaterial color="#1F4D36" roughness={0.85} />
      </mesh>
    </group>
  );
}
