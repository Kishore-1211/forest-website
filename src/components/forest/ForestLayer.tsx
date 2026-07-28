"use client";

interface ForestLayerProps {
  src: string;
  className?: string;
}

export function ForestLayer({
  src,
  className = "",
}: ForestLayerProps) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className={`pointer-events-none select-none ${className}`}
    />
  );
}