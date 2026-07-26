import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps {
  children: ReactNode;
  /** Constrains to the ~720px reading column used by copy-heavy sections (e.g. Story). */
  narrow?: boolean;
  className?: string;
}

export function Container({ children, narrow = false, className }: ContainerProps) {
  return (
    <div
      className={cn(
        narrow ? "max-w-[45rem]" : "max-w-[1440px]",
        "mx-auto px-4 sm:px-6 md:px-8 lg:px-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
