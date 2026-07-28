"use client";

import Image from "next/image";
import { FogLayer } from "./FogLayer";

export function ForestScene() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Sky */}
      <Image
        src="/forest/sky.jpg"
        alt=""
        fill
        priority
        unoptimized
        draggable={false}
        className="object-cover select-none z-0"
      />

      {/* Sun Rays — this one genuinely works as-is: it's on a solid black
          background, and mix-blend-screen makes black vanish while the
          bright rays stay visible. No mask needed here. */}
      <Image
        src="/forest/sun-rays.jpg"
        alt=""
        fill
        priority
        unoptimized
        draggable={false}
        data-parallax="0.08"
        className="
          object-cover
          mix-blend-screen
          opacity-35
          select-none
          z-10
        "
      />

      {/* Background Forest — tress-back.jpeg is a full photo with its own
          sky baked in. Instead of relying on transparency (JPEGs can't have
          any), a mask fades the top ~55% to transparent so only the
          treeline silhouette survives, letting the real Sky/Sun-Rays layers
          underneath show through above it. */}
      <div
        data-parallax="0.15"
        className="absolute inset-0 z-20"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, transparent 52%, black 62%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, transparent 52%, black 62%, black 100%)",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      >
        <Image
          src="/forest/trees-back.jpg"
          alt=""
          fill
          priority
          unoptimized
          draggable={false}
          className="object-cover opacity-70 select-none"
        />
      </div>

      {/* Mid Trees — tree-mid.jpeg is a full photo (trunk, path, its own
          sky), not an isolated cutout. A radial mask keeps the left/right
          tree edges opaque and dissolves the center to transparent, faking
          the "framing arch" the composition needs without needing real
          alpha in the source file. */}
      <div
        data-parallax="0.3"
        className="absolute inset-0 z-40"
        style={{
          maskImage: "radial-gradient(ellipse 62% 85% at center, transparent 35%, black 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 62% 85% at center, transparent 35%, black 78%)",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      >
        <Image
          src="/forest/tree-mid.jpg"
          alt=""
          fill
          priority
          unoptimized
          draggable={false}
          className="object-cover select-none"
        />
      </div>

      {/* Foreground Trees — same masking technique as Mid Trees, but the
          transparent zone is wider so more of this closer layer dissolves
          away, keeping only strong tree trunks/canopy right at the edges,
          consistent with it reading as the nearest depth layer. */}
      <div
        data-parallax="0.5"
        className="absolute inset-0 z-50"
        style={{
          maskImage: "radial-gradient(ellipse 72% 90% at center, transparent 45%, black 82%)",
          WebkitMaskImage: "radial-gradient(ellipse 72% 90% at center, transparent 45%, black 82%)",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      >
        <Image
          src="/forest/tree-front.jpg"
          alt=""
          fill
          priority
          unoptimized
          draggable={false}
          className="object-cover select-none"
        />
      </div>

      {/* Forest Floor — was previously staying opaque for ~78% of the
          frame (far too tall), blocking every layer stacked beneath it.
          Now only opaque in a thin strip near the very bottom, fading to
          fully transparent well before the midpoint, so it reads as a
          ground floor instead of a second full-screen photo. */}
      <div
        data-parallax="0.7"
        className="absolute inset-0 z-[60]"
        style={{
          maskImage: "linear-gradient(to top, black 0%, black 10%, transparent 32%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, black 10%, transparent 32%)",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      >
        <Image
          src="/forest/grass.jpg"
          alt=""
          fill
          priority
          unoptimized
          draggable={false}
          className="object-cover select-none"
        />
      </div>

      {/* Warm Grade — ties sky/rays/trees into one golden-hour cast instead
          of each layer showing its own independent tone. Sits above every
          image layer but below the cinematic vignette below. */}
      <div
        className="
          absolute
          inset-0
          z-[65]
          bg-amber-400/10
          mix-blend-overlay
        "
      />

      {/* Cinematic Gradient */}
      <div
        className="
          absolute
          inset-0
          z-[70]
          bg-gradient-to-b
          from-black/5
          via-transparent
          to-black/35
        "
      />
    </div>
  );
}