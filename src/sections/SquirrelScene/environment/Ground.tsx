"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { createGroundMaps } from "./groundTexture";

/**
 * Forest floor for the 3D scene.
 *
 * Previously a flat, untextured `circleGeometry` disc: uniform lighting across
 * every pixel and a hard polygonal rim, which is what made it read as a 2D
 * cut-out under a 3D squirrel. Now a large subdivided plane with vertex
 * displacement for silhouette, plus a procedural colour/normal pair (see
 * groundTexture.ts) so the surface catches the low sun instead of shading flat.
 */

/** Extends past the fog far-plane so the plane's own edge is never visible. */
const SIZE = 44;
/** Enough subdivisions for the displacement to read as smooth mounds. */
const SEGMENTS = 120;
/** Tile count across SIZE — small enough that litter detail stays legible. */
const TEXTURE_REPEAT = 22;

/**
 * Props sit on y=0 around the origin (squirrel [-0.6,0,1], rock [0.5,0,0.6]),
 * so displacement has to stay flat under them or they'd float/sink. These are
 * the smoothstep bounds that ramp height in once we're clear of that area.
 */
const FLAT_RADIUS = 1.6;
const FULL_DISPLACE_RADIUS = 5;

function displace(geometry: THREE.PlaneGeometry) {
  const pos = geometry.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i += 1) {
    v.fromBufferAttribute(pos, i);
    // Plane is built in XY and rotated into place below, so `y` here is depth.
    const distance = Math.hypot(v.x, v.y);

    // Two octaves: broad rolling mounds plus a finer ripple for surface break-up.
    const broad = Math.sin(v.x * 0.13 + 1.7) * Math.cos(v.y * 0.16) * 0.55;
    const fine = Math.sin(v.x * 0.44) * Math.cos(v.y * 0.38 + 0.6) * 0.12;

    pos.setZ(
      i,
      (broad + fine) * THREE.MathUtils.smoothstep(distance, FLAT_RADIUS, FULL_DISPLACE_RADIUS),
    );
  }

  pos.needsUpdate = true;
  // Normals must be rebuilt from the displaced positions or the surface would
  // still shade as if perfectly flat — the whole point of the displacement.
  geometry.computeVertexNormals();
}

export function Ground() {
  const maps = useMemo(() => createGroundMaps(TEXTURE_REPEAT), []);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    displace(geo);
    return geo;
  }, []);

  // The section only mounts while in view, so release GPU resources on exit.
  useEffect(() => {
    return () => {
      maps.dispose();
      geometry.dispose();
    };
  }, [maps, geometry]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial
        map={maps.map}
        normalMap={maps.normalMap}
        // Tangent-space normals are subtle by design here: the displaced
        // geometry already carries the large shapes, this only adds grain.
        normalScale={new THREE.Vector2(0.6, 0.6)}
        roughness={0.95}
      />
    </mesh>
  );
}
