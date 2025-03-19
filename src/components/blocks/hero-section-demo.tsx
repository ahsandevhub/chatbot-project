import { HeroSection } from "@/components/blocks/hero-section";

export function HeroSectionDemo() {
  // Use the user's uploaded image for the mockup
  const mockupImage =
    "/lovable-uploads/660ca57e-eabd-48a6-aa45-9d55dc5b8597.png";
  const mockupImageDark =
    "/lovable-uploads/660ca57e-eabd-48a6-aa45-9d55dc5b8597-dark.png";

  return (
    <HeroSection
      title="Historical Market Data on Demand"
      description="Just Ask our AI-Powered Assistant. No Code."
      announcement={{
        text: "Our services are intended for personal/non-professional use only.",
      }}
      actions={[
        {
          text: "Start Free",
          href: "/login",
          variant: "default",
        },
      ]}
      image={{
        light: mockupImage,
        dark: mockupImageDark,
        alt: "AI Assistant Interface",
      }}
    />
  );
}
