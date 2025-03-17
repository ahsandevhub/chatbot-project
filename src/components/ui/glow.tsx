
import React from "react";
import { cn } from "@/lib/utils";

interface GlowProps {
  variant?: "bottom" | "top";
  className?: string;
}

export function Glow({ variant = "bottom", className }: GlowProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        variant === "bottom" && "bottom-0 top-auto",
        variant === "top" && "bottom-auto top-0",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -z-10 h-[50vh] w-full",
          variant === "bottom" && "bottom-[-20vh]",
          variant === "top" && "top-[-35vh]",
          "opacity-50 blur-[100px]"
        )}
      >
        <div
          className={cn(
            "h-full w-full rounded-full bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30"
          )}
        />
      </div>
    </div>
  );
}
