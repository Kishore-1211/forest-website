"use client";

/**
 * PLACEHOLDER GEOMETRY — stands in for ASSETS.md's `rock.glb`. Swap for a
 * `useGLTF("/models/rock.glb")` result once that file exists in
 * `public/models/`.
 */
export function Rock() {
  return (
    <mesh position={[1.1, 0.25, 0.6]} rotation={[0.3, 0.5, 0]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.35, 0]} />
      <meshStandardMaterial color="#6B6B5E" roughness={1} />
    </mesh>
  );
}
