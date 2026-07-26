"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/layout/Container";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { Button } from "@/components/ui/Button";
import { SectionDescription } from "@/components/ui/SectionDescription";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { DURATION, fadeIn, fadeInUp, scrollTriggerDefaults } from "@/lib/animation";
import { useReveal } from "@/hooks/useReveal";

export function HeroForest() {
  const { ref, prefersReducedMotion, addToContext } = useReveal<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    addToContext(() => {
      const title = root.querySelector<HTMLElement>("[data-title]");
      const description = root.querySelector<HTMLElement>("[data-description]");
      const cta = root.querySelector<HTMLElement>("[data-cta]");
      if (!title || !description || !cta) return;

      const container = fadeIn({ duration: DURATION.normal });
      const headline = fadeInUp({ duration: DURATION.large });
      const desc = fadeInUp({ duration: DURATION.normal });
      const button = fadeIn({ duration: DURATION.normal });

      gsap
        .timeline()
        .fromTo(root, container.from, container.to)
        .fromTo(title, headline.from, headline.to, "-=0.3")
        .fromTo(description, desc.from, desc.to, "-=0.3")
        .fromTo(cta, button.from, button.to, "-=0.2");

      // Pin/scrub is itself scroll-driven motion, separate from the entrance
      // reveal above — skip it under reduced motion rather than collapsing
      // its duration, since a pinned viewport changes scroll behavior itself.
      if (!prefersReducedMotion) {
        ScrollTrigger.create(
          scrollTriggerDefaults(root, {
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 1,
            // Scrubs the cinematic video's playback position to scroll
            // progress, per ASSETS.md's "scroll-controlled opening
            // sequence." No-ops safely while hero-cinematic.{webm,mp4}
            // doesn't exist yet — duration is NaN, so the assignment is
            // skipped rather than erroring.
            onUpdate: (self) => {
              const video = videoRef.current;
              if (video && video.duration) {
                video.currentTime = self.progress * video.duration;
              }
            },
          }),
        );
      }
    });

    // Reduced-motion preference is read once at mount — the reveal factories
    // already collapse to an instant, fully-visible state when it's on, so
    // there's nothing to reactively rebuild if it changes mid-session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref}>
      <SectionContainer
        id="hero-forest"
        background="soft-white"
        backgroundImage={{ src: "/images/hero-bg.avif", alt: "Golden-hour sunlight through forest trees" }}
      >
        {/*
          Poster-like fallback: SectionContainer's backgroundImage above
          renders first, so this sits above it once its metadata loads.
          Scrubbed by the ScrollTrigger above, not autoplaying/looping.
        */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="metadata"
          aria-hidden
        >
          <source src="/videos/hero-cinematic.webm" type="video/webm" />
          <source src="/videos/hero-cinematic.mp4" type="video/mp4" />
        </video>
        {/*
          `relative` here isn't just for layout — an absolutely-positioned
          sibling (the video) paints above static in-flow content by default
          regardless of DOM order, so this needs to be a positioned element
          too for its later DOM position to actually win the stacking order.
        */}
        <div className="relative">
          <Container>
            <div className="flex flex-col items-start gap-6">
              <SectionTitle as="h1" id="hero-forest-title">
                Walk Into the Forest
              </SectionTitle>
              <SectionDescription>
                A cinematic journey through a living forest, told one scroll at a time.
              </SectionDescription>
              <div data-cta className="inline-block">
                <Button variant="primary">Begin the Journey</Button>
              </div>
            </div>
          </Container>
        </div>
      </SectionContainer>
    </div>
  );
}
