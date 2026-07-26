import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

// Primary hover treatment per DESIGN_SYSTEM.md: brightness increase, scale
// 1.02, soft (non-colored) shadow enhancement — no glow. Secondary has no
// hover spec beyond its outline, so it's left alone.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-forest-green text-soft-white transition duration-[250ms] ease-out hover:scale-[1.02] hover:brightness-110 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:brightness-100 motion-reduce:hover:shadow-none",
  secondary: "border border-current bg-transparent",
};

export function Button({
  variant = "primary",
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "rounded-full px-8 py-3 text-base font-medium",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-gold",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
