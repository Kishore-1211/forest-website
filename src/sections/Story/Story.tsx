"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
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
      const image = root.querySelector<HTMLElement>("[data-parallax]");

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
      // with the text reveal rather than sequenced with it.
      if (image) {
        timeline.fromTo(image, { yPercent: -6 }, { yPercent: 6, ease: "none", duration: timeline.duration() }, 0);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref}>
      <SectionContainer id="story" background="deep-forest">
        {/*
          Rendered directly here (not via SectionContainer's backgroundImage
          prop) so the timeline above can target it by ref for parallax —
          that prop only supports a static, unanimated background.
        */}
        <Image
          data-parallax
          src="/images/story.avif"
          alt="A walking path through a peaceful forest"
          fill
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-deep-forest/40" aria-hidden />
        <div className="relative">
          <Container narrow>
            <div className="flex flex-col gap-6">
              <SectionTitle id="story-title">A Story Older Than the Trees</SectionTitle>
              <SectionDescription>
                Placeholder paragraph one describing the origin of the forest and why this
                journey exists. Final narrative copy will replace this text.
              </SectionDescription>
              <SectionDescription>
                Placeholder paragraph two continuing the narrative thread, setting up what
                the visitor is about to encounter deeper in the scroll.
              </SectionDescription>
              <SectionDescription>
                Placeholder paragraph three, closing this section before the visitor
                continues into the signature moment ahead.
              </SectionDescription>
            </div>
          </Container>
        </div>
      </SectionContainer>
    </div>
  );
}
