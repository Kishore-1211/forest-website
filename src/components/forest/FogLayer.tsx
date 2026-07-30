"use client";

import type { CSSProperties } from "react";

/**
 * Volumetric mid-ground mist for the Story forest scene.
 *
 * Rendered as blurred CSS radial gradients rather than a raster sprite: the
 * former fog.png shipped as an opaque RGB image with the editor's transparency
 * checkerboard flattened into its pixels (no alpha channel), so it painted a
 * visible gray grid over the scene. Gradients keep the soft, diffuse look with
 * no image download and no possible alpha artifacts.
 *
 * Two stacked layers at z-[35]/z-[36] sit between trees-back (z-20) and
 * tree-mid (z-40), matching the mid-ground depth noted in ForestScene. No
 * data-parallax: fog is diffuse and holds position while the tree layers drift.
 */
const FOG_LAYERS: { className: string; style: CSSProperties }[] = [
  {
    // Broad base bank of mist hugging the forest floor.
    className: "absolute inset-x-[-10%] bottom-[8%] h-[55%] z-[35] pointer-events-none",
    style: {
      filter: "blur(30px)",
      backgroundImage: [
        "radial-gradient(60% 80% at 50% 60%, rgba(245,248,250,0.55), rgba(245,248,250,0) 70%)",
        "radial-gradient(45% 60% at 32% 55%, rgba(230,238,242,0.40), rgba(230,238,242,0) 72%)",
        "radial-gradient(45% 60% at 70% 62%, rgba(230,238,242,0.38), rgba(230,238,242,0) 72%)",
      ].join(","),
    },
  },
  {
    // Brighter, tighter core drifting just above the base bank.
    className: "absolute inset-x-[-5%] bottom-[16%] h-[40%] z-[36] pointer-events-none opacity-70",
    style: {
      filter: "blur(24px)",
      backgroundImage:
        "radial-gradient(55% 70% at 50% 55%, rgba(255,255,255,0.50), rgba(255,255,255,0) 70%)",
    },
  },
];

export function FogLayer() {
  return (
    <>
      {FOG_LAYERS.map((layer, i) => (
        <div key={i} aria-hidden className={layer.className} style={layer.style} />
      ))}
    </>
  );
}
