
import React from "react";
import { cn } from "@/lib/utils";

interface MockupProps {
  type?: "browser" | "device" | "responsive";
  children: React.ReactNode;
  className?: string;
}

interface MockupFrameProps {
  children: React.ReactNode;
  className?: string;
  size?: "small" | "medium" | "large";
}

export function Mockup({ type = "browser", children, className }: MockupProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-300 bg-background shadow-xl",
        className
      )}
    >
      {type === "browser" && (
        <div className="flex items-center gap-2 border-b border-border bg-muted p-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1">
            <div className="mx-auto h-5 w-3/4 rounded-full bg-border/50" />
          </div>
        </div>
      )}
      {type === "device" && (
        <div className="flex justify-between border-b border-border bg-muted p-2">
          <div className="mx-auto h-4 w-1/3 rounded-full bg-border/50" />
        </div>
      )}
      <div className="bg-background">{children}</div>
    </div>
  );
}

export function MockupFrame({ children, className, size = "medium" }: MockupFrameProps) {
  const sizeClasses = {
    small: "max-w-3xl",
    medium: "max-w-4xl",
    large: "max-w-6xl",
  };

  return (
    <div className={cn("mx-auto w-full", sizeClasses[size], className)}>
      {children}
    </div>
  );
}
