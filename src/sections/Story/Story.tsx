"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { ForestScene } from "@/components/forest/ForestScene";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionDescription } from "@/components/ui/SectionDescription";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE, REVEAL_DISTANCE, STAGGER, fadeInUp, scrollTriggerDefaults } from "@/lib/animation";
import { useReveal } from "@/hooks/useReveal";

export function Story() {
  const { ref, prefersReducedMotion, addToContext } = useReveal<HTMLDivElement>();

  useEffect(() => {
    // Story's only animation is this scroll-tied pin/fade — under reduced
    // motion there's no separate static entrance to fall back to, so skip
    // creating it entirely and leave the text in its natural, fully-visible
    // DOM state instead of collapsing durations to zero.
    if (prefersReducedMotion) return;

    const root = ref.current;
    if (!root) return;

    addToContext(() => {
      const targets = root.querySelectorAll<HTMLElement>("[data-title], [data-description]");
      if (!targets.length) return;

      const enter = fadeInUp({ duration: DURATION.large });
      const timeline = gsap
        .timeline({
          scrollTrigger: scrollTriggerDefaults(root, {
            start: "top top",
            // Short pin, per ANIMATION.md — unlike Hero/Squirrel, Story keeps
            // its extra scroll track close to one viewport rather than
            // extending it for a scrubbed background sequence.
            end: "+=40%",
            scrub: 1,
            pin: true,
          }),
        })
        .fromTo(targets, enter.from, { ...enter.to, stagger: STAGGER })
        .to(targets, { opacity: 1, duration: DURATION.large })
        .to(targets, {
          opacity: 0,
          y: -REVEAL_DISTANCE,
          duration: DURATION.large,
          ease: EASE.out3,
        });

      // Gentle parallax drift across the whole pinned duration, in parallel
      // with the text reveal rather than sequenced with it. Each forest
      // layer carries its own `data-parallax` speed (0 = static, 1 = fastest),
      // set once the total timeline length is known so every layer drifts
      // over the *entire* pin regardless of how long the text tweens are.
      const parallaxLayers = root.querySelectorAll<HTMLElement>("[data-parallax]");
      const pinDuration = timeline.duration();

      parallaxLayers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.parallax ?? "0");
        if (!speed) return;

        timeline.fromTo(
          layer,
          { yPercent: 0 },
          {
            yPercent: -20 * speed,
            ease: "none",
            duration: pinDuration,
          },
          0, // start at the same point as the text reveal, not after it
        );
      });
    }); // <-- closes addToContext()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <-- closes useEffect()

  return (
    <div ref={ref}>
      {/* Cool dawn mist — the first beat of the time-of-day arc, deliberately
          the coolest point so the golden-hour 3D scene that follows reads warm
          by contrast. */}
      <SectionContainer id="story" background="dawn-mist">
        <ForestScene />
        {/*
          Rendered directly here (not via SectionContainer's backgroundImage
          prop) so the timeline above can target it by ref for parallax —
          that prop only supports a static, unanimated background.
        */}
   
        <div className="absolute inset-0 z-10 bg-dawn-mist/45" aria-hidden />
        <div className="relative z-20">
          <Container narrow>
            <div className="flex flex-col gap-6">
              <SectionTitle id="story-title">A Story Older Than the Trees</SectionTitle>
              <SectionDescription>
                Long before roads were drawn through these hills, the forest was already ancient.
                It grew in silence, season by season, indifferent to everything beyond its canopy.
              </SectionDescription>
              <SectionDescription>
                Each ring of bark records a year the world never noticed. A fallen branch becomes
                shelter. A clearing becomes a stage for light. Nothing here is wasted.
              </SectionDescription>
              <SectionDescription>
                This journey follows no map. The only direction is deeper.
              </SectionDescription>
            </div>
          </Container>
        </div>
      </SectionContainer>
    </div>
  );
}
