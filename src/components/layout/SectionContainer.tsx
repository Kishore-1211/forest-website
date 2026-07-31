import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export type SectionBackground =
  | "charcoal"
  | "deep-forest"
  | "forest-green"
  | "soft-white"
  /* Time-of-day tones — see the note beside these tokens in globals.css. */
  | "dawn-mist"
  | "golden-earth"
  | "dusk-violet";

/**
 * Centralizes background/foreground pairing so an invalid combination
 * (e.g. charcoal text on charcoal background) is structurally impossible.
 */
const TONE: Record<SectionBackground, { bg: string; fg: string; scrim: string }> = {
  // `scrim` darkens/lightens toward each tone's own foreground color, so a
  // background image can't undermine that tone's text contrast.
  charcoal: { bg: "bg-charcoal", fg: "text-soft-white", scrim: "bg-charcoal/40" },
  "deep-forest": { bg: "bg-deep-forest", fg: "text-soft-white", scrim: "bg-deep-forest/40" },
  "forest-green": { bg: "bg-forest-green", fg: "text-soft-white", scrim: "bg-forest-green/40" },
  "soft-white": { bg: "bg-soft-white", fg: "text-charcoal", scrim: "bg-soft-white/50" },
  "dawn-mist": { bg: "bg-dawn-mist", fg: "text-soft-white", scrim: "bg-dawn-mist/40" },
  "golden-earth": { bg: "bg-golden-earth", fg: "text-soft-white", scrim: "bg-golden-earth/40" },
  "dusk-violet": { bg: "bg-dusk-violet", fg: "text-soft-white", scrim: "bg-dusk-violet/40" },
};

interface SectionContainerProps {
  /** Anchors the section and drives its aria-labelledby target (`${id}-title`). */
  id: string;
  background: SectionBackground;
  children: ReactNode;
  className?: string;
  /**
   * Static full-bleed background image per ASSETS.md (e.g. `/images/cta-bg.avif`).
   * `tone.bg` stays underneath as a fallback if the file is missing, and a
   * scrim keeps foreground text contrast regardless of the photo's content.
   * Sections needing scroll-linked parallax (Story, Magical Forest) render
   * their own `<Image>` instead, so it can be animated.
   */
  backgroundImage?: { src: string; alt: string };
}

export function SectionContainer({
  id,
  background,
  children,
  className,
  backgroundImage,
}: SectionContainerProps) {
  const tone = TONE[background];

  return (
    <section
      id={id}
      data-section={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        // `isolate` is load-bearing, not cosmetic: it makes this section its own
        // stacking context so the negative-z `backgroundImage`/scrim below stay
        // *inside* it. Without it, `position: relative; z-index: auto` is not a
        // stacking context, so those children escape to the nearest ancestor one
        // where negative z-index paints before in-flow block backgrounds — and
        // this section's own `tone.bg` would paint straight over the photo.
        "relative isolate flex min-h-screen flex-col justify-center overflow-hidden py-16 md:py-24 lg:py-32",
        tone.bg,
        tone.fg,
        className,
      )}
    >
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt}
            fill
            sizes="100vw"
            className="absolute inset-0 -z-20 object-cover"
          />
          <div className={cn("absolute inset-0 -z-10", tone.scrim)} aria-hidden />
        </>
      )}
      {children}
    </section>
  );
}
