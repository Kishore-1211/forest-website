"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { Container } from "@/components/layout/Container";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionDescription } from "@/components/ui/SectionDescription";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useInView } from "@/hooks/useInView";
import { useReveal } from "@/hooks/useReveal";
import { ScrollTrigger } from "@/lib/gsap";
import { scrollTriggerDefaults } from "@/lib/animation";
import type { ScrollProgress, SquirrelCanvasProps } from "./SquirrelCanvas";

// Kept out of the server bundle entirely — three.js/@react-three/fiber only
// ever need to exist client-side, and only once this section nears view.
const SquirrelCanvas = dynamic<SquirrelCanvasProps>(
  () => import("./SquirrelCanvas").then((mod) => mod.SquirrelCanvas),
  { ssr: false },
);

export function SquirrelScene() {
  const { ref, prefersReducedMotion, addToContext } = useReveal<HTMLDivElement>();
  const { ref: canvasHostRef, isInView } = useInView<HTMLDivElement>();
  const progressRef = useRef<ScrollProgress>({ value: 0 });

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    addToContext(() => {
      // The pin/scrub itself is scroll-driven motion — skip it under reduced
      // motion rather than compressing it, same as Hero's pinned track.
      // CameraRig also independently clamps to its resting frame when
      // reduced motion is on, so this is belt-and-suspenders, not load-
      // bearing on its own.
      if (prefersReducedMotion) return;

      ScrollTrigger.create(
        scrollTriggerDefaults(root, {
          start: "top top",
          // Extended pinned track (per DESIGN_SYSTEM.md's Hero/Squirrel
          // exception) gives the camera dolly room to play out slowly.
          end: "+=150%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            progressRef.current.value = self.progress;
          },
        }),
      );
    });

    // Reduced-motion is read once at mount, matching HeroForest.tsx.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref}>
      <SectionContainer id="squirrel-scene" background="deep-forest">
        <div ref={canvasHostRef} className="absolute inset-0">
          {isInView && <SquirrelCanvas progressRef={progressRef} />}
        </div>
        {/*
          `relative` here isn't just for layout — an absolutely-positioned
          sibling (the canvas) paints above static in-flow content by
          default regardless of DOM order, so this needs to be a positioned
          element too for its later DOM position to actually win the
          stacking order (same pattern as HeroForest's video overlay).
        */}
        <div className="relative">
          <Container>
            <div className="flex flex-col items-center gap-6 text-center">
              <SectionTitle id="squirrel-scene-title">The Signature Moment</SectionTitle>
              <SectionDescription>
                Meet the forest&rsquo;s quiet resident, rendered live in real time.
              </SectionDescription>
            </div>
          </Container>
        </div>
      </SectionContainer>
    </div>
  );
}
