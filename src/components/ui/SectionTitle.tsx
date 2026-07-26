import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface SectionTitleProps {
  /** Heading level — only HeroForest should ever pass "h1"; others use "h2". */
  as?: HeadingLevel;
  /** Must match the `${sectionId}-title` id SectionContainer expects for aria-labelledby. */
  id: string;
  children: ReactNode;
  className?: string;
}

export function SectionTitle({ as: Tag = "h2", id, children, className }: SectionTitleProps) {
  return (
    <Tag
      id={id}
      data-title
      data-reveal
      className={cn("text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl", className)}
    >
      {children}
    </Tag>
  );
}
