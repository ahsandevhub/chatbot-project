"use client";

import { Badge } from "@/components/ui/badge";
import { Glow } from "@/components/ui/glow";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/MovingBorderButton";

interface HeroAction {
  text: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default" | "glow" | "moving-border"; // Add moving-border variant
}

interface HeroProps {
  badge?: {
    text: string;
    action: {
      text: string;
      href: string;
    };
  };
  announcement?: {
    label?: string;
    text: string;
  };
  title: string;
  description: string;
  actions: HeroAction[];
  image: {
    light: string;
    dark: string;
    alt: string;
  };
}

export function HeroSection({
  badge,
  announcement,
  title,
  description,
  actions,
  image,
}: HeroProps) {
  const imageSrc = image.light;
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className={cn(
        "bg-background text-foreground font-inter",
        "py-12 sm:py-24 md:py-32 px-4",
        "fade-bottom overflow-hidden pb-0"
      )}
    >
      <div className="mx-auto flex max-w-container flex-col gap-12 pt-0 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {/* Announcement */}
          {announcement && (
            <div className="animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:50ms]">
              <div className="flex items-center justify-center rounded-full bg-gray-100 py-1 px-4 text-sm">
                <span className="text-gray-600">{announcement.text}</span>
              </div>
            </div>
          )}

          {/* Badge */}
          {badge && (
            <Badge
              variant="outline"
              className="animate-fade-in opacity-0 [animation-fill-mode:forwards] gap-2"
            >
              <span className="text-muted-foreground">{badge.text}</span>
              <a href={badge.action.href} className="flex items-center gap-1">
                {badge.action.text}
                <ArrowRightIcon className="h-3 w-3" />
              </a>
            </Badge>
          )}

          {/* Title */}
          <h1 className="relative z-10 inline-block animate-fade-in opacity-0 [animation-delay:100ms] [animation-fill-mode:forwards] bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
            {/* Replace spaces with non-breaking spaces where needed */}
            {title.replace("on Demand", "on\u00A0Demand")}
          </h1>

          {/* Description */}
          <p className="text-md relative z-10 max-w-[550px] animate-fade-in opacity-0 [animation-delay:150ms] [animation-fill-mode:forwards] font-medium text-muted-foreground sm:text-xl">
            {description}
          </p>

          {/* Action button, with Moving Border Effect */}
          {/* <div className="relative z-10 flex animate-fade-in opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards] justify-center gap-4">
            {actions.map((action, index) => {
              if (action.variant === "moving-border") {
                return (
                  <Button
                    key={index}
                    borderRadius="1.75rem"
                    className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    asChild
                  >
                    <a href={action.href} className="flex items-center gap-2">
                      {action.icon}
                      {action.text}
                    </a>
                  </Button>
                );
              } else {
                return (
                  <Button
                    key={index}
                    variant={action.variant === "glow" ? "outline" : "default"}
                    size="lg"
                    asChild
                  >
                    <a href={action.href} className="flex items-center gap-2">
                      {action.icon}
                      {action.text}
                    </a>
                  </Button>
                );
              }
            })}
          </div> */}

          <div className="relative z-10 flex animate-fade-in opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards] justify-center gap-4">
            <Button
              borderRadius="1.75rem"
              className="bg-black dark:bg-black text-white dark:text-white border-gray-200 dark:border-gray-800"
              onClick={() => navigate("/login")}
            >
              Start Free
            </Button>
          </div>

          {/* Image with Glow */}
          <div className="relative pt-12">
            <MockupFrame
              className="animate-fade-in opacity-0 [animation-delay:250ms] [animation-fill-mode:forwards]"
              size="small"
            >
              <Mockup type="responsive">
                <img
                  src={imageSrc}
                  alt={image.alt}
                  width={1248}
                  height={765}
                  className="w-full"
                />
              </Mockup>
            </MockupFrame>
            <Glow
              variant="top"
              className="animate-fade-in opacity-0 [animation-delay:300ms] [animation-fill-mode:forwards]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
