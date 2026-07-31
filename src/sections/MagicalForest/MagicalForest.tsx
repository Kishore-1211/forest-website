"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionDescription } from "@/components/ui/SectionDescription";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { gsap } from "@/lib/gsap";
import { DURATION, fadeInUp, scrollTriggerDefaults } from "@/lib/animation";
import { useReveal } from "@/hooks/useReveal";

export function MagicalForest() {
  const { ref, prefersReducedMotion, addToContext } = useReveal<HTMLDivElement>();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const root = ref.current;
    if (!root) return;

    addToContext(() => {
      const title = root.querySelector<HTMLElement>("[data-title]");
      const description = root.querySelector<HTMLElement>("[data-description]");
      const image = root.querySelector<HTMLElement>("[data-parallax]");

      if (title && description) {
        const headline = fadeInUp({ duration: DURATION.large });
        const desc = fadeInUp({ duration: DURATION.normal });

        // Not pinned, unlike Story — ANIMATION.md doesn't call for a pin
        // here, just a gentle reveal-on-enter/reverse-on-exit.
        gsap
          .timeline({
            scrollTrigger: scrollTriggerDefaults(root, { start: "top 80%", end: "bottom top" }),
          })
          .fromTo(title, headline.from, headline.to)
          .fromTo(description, desc.from, desc.to, "-=0.3");
      }

      // Background parallax runs across the section's entire natural
      // scroll range (no pin) — a continuous drift rather than a staged
      // sequence, per ANIMATION.md's "Background image parallax."
      if (image) {
        gsap.fromTo(
          image,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: scrollTriggerDefaults(root, {
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }),
          },
        );
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref}>
      {/* Dusk — cools back down after the golden-hour peak, so the bright
          soft-white CTA that follows lands as daybreak rather than more of the
          same. */}
      <SectionContainer id="magical-forest" background="dusk-violet">
        {/*
          Rendered directly (not via SectionContainer's backgroundImage
          prop) so it can be targeted for parallax — that prop is
          static-only. The fog loop video sits above it as an ambient,
          looping atmosphere layer per ASSETS.md's "Magical Fog Loop."
        */}
        <Image
          data-parallax
          src="/images/magic.avif"
          alt="Light rays and soft mist through the forest canopy"
          fill
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-dusk-violet/45" aria-hidden />
        <video
          className="absolute inset-0 h-full w-full object-cover"
          muted
          autoPlay
          loop
          playsInline
          preload="none"
          aria-hidden
        >
          <source src="/videos/magic-fog.webm" type="video/webm" />
          <source src="/videos/magic-fog.mp4" type="video/mp4" />
        </video>
        {/*
          Dusk grade. The scrim above sits at -z-10, below this full-bleed
          video, so it can't tone the section's dominant visual — without this
          the video plays at its own neutral-green cast regardless of the
          section tone. Positioned (not negative-z) and placed after the video
          but before the copy, so it grades the video and leaves text legible.
        */}
        <div
          className="absolute inset-0 bg-dusk-violet/35 mix-blend-multiply"
          aria-hidden
        />
        {/* `relative` so this stacks above the video sibling — see the same note in HeroForest.tsx. */}
        <div className="relative">
          <Container>
            <div className="flex flex-col items-start gap-6">
              <SectionTitle id="magical-forest-title">Wonder Settles Into Calm</SectionTitle>
              <SectionDescription>
                After every wonder, the forest returns to silence. Light drifts through fog
                as if time itself has slowed — a reminder that some moments are meant not
                to be rushed, but inhabited.
              </SectionDescription>
            </div>
          </Container>
        </div>
      </SectionContainer>
    </div>
  );
}
