import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return <span className={cn("text-lg font-bold tracking-tight", className)}>Forest</span>;
}
