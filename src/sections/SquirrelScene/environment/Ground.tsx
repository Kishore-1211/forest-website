"use client";

/**
 * Procedural ground plane. Not one of ASSETS.md's three named models
 * (squirrel/tree/rock), so this isn't slated for a GLB swap — it's the
 * scene's floor.
 */
export function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[4, 32]} />
      <meshStandardMaterial color="#3A4A32" roughness={1} />
    </mesh>
  );
}
