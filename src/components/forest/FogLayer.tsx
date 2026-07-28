"use client";

import Image from "next/image";

export function FogLayer() {
  return (
    <>
      {/* Fog Layer 1 */}
      <div
        className="
          absolute
          bottom-[8%]
          left-1/2
          -translate-x-1/2
          w-[130%]
          opacity-30
          z-[35]
          pointer-events-none
        "
      >
        <Image
          src="/forest/fog.png"
          alt=""
          width={2400}
          height={800}
          priority
          draggable={false}
          className="w-full h-auto select-none"
        />
      </div>

      {/* Fog Layer 2 */}
      <div
        className="
          absolute
          bottom-[15%]
          left-1/2
          -translate-x-1/2
          w-[115%]
          opacity-20
          z-[36]
          pointer-events-none
        "
      >
        <Image
          src="/forest/fog.png"
          alt=""
          width={2200}
          height={700}
          priority
          draggable={false}
          className="w-full h-auto select-none"
        />
      </div>
    </>
  );
}