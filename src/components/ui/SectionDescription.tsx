import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function SectionDescription({ children, className }: SectionDescriptionProps) {
  return (
    <p
      data-description
      data-reveal
      className={cn("text-base font-normal leading-relaxed md:text-lg", className)}
    >
      {children}
    </p>
  );
}
