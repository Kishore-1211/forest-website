"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { Button } from "@/components/ui/Button";
import { SectionDescription } from "@/components/ui/SectionDescription";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { gsap } from "@/lib/gsap";
import { DURATION, fadeIn, fadeInUp, scrollTriggerDefaults } from "@/lib/animation";
import { useReveal } from "@/hooks/useReveal";

export function FinalCTA() {
  const { ref, prefersReducedMotion, addToContext } = useReveal<HTMLDivElement>();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const root = ref.current;
    if (!root) return;

    addToContext(() => {
      const title = root.querySelector<HTMLElement>("[data-title]");
      const description = root.querySelector<HTMLElement>("[data-description]");
      const cta = root.querySelector<HTMLElement>("[data-cta]");
      if (!title || !description || !cta) return;

      const headline = fadeInUp({ duration: DURATION.large });
      const desc = fadeInUp({ duration: DURATION.normal });
      const buttons = fadeIn({ duration: DURATION.normal });

      // Not pinned — DESIGN_SYSTEM.md reserves extended pinning for Hero and
      // the Signature 3D Scene only. This is a one-shot reveal that plays on
      // enter and reverses on exit (scrollTriggerDefaults' default
      // toggleActions), no scrub.
      gsap
        .timeline({
          scrollTrigger: scrollTriggerDefaults(root, {
            start: "top 80%",
            end: "bottom top",
          }),
        })
        .fromTo(title, headline.from, headline.to)
        .fromTo(description, desc.from, desc.to, "-=0.3")
        .fromTo(cta, buttons.from, buttons.to, "-=0.2");
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref}>
      <SectionContainer
        id="final-cta"
        background="soft-white"
        backgroundImage={{ src: "/images/cta-bg.avif", alt: "A bright forest clearing opening ahead" }}
      >
        <Container>
          <div className="flex flex-col items-start gap-6">
            <SectionTitle id="final-cta-title">Begin Your Own Journey</SectionTitle>
            <SectionDescription>
              The forest is patient. It waits for those willing to slow down, look closer,
              and step off the path. Your journey begins here.
            </SectionDescription>
            <div data-cta className="flex flex-col gap-4 sm:flex-row">
              <Button variant="primary">Explore Forest</Button>
              <Button variant="secondary">Learn More</Button>
            </div>
          </div>
        </Container>
      </SectionContainer>
    </div>
  );
}
