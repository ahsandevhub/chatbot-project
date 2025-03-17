import { HeroSectionDemo } from "@/components/blocks/hero-section-demo";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Pricing } from "@/components/ui/pricing-section-with-comparison";
import React, { useEffect } from "react";

const Index: React.FC = () => {
  // Intersection Observer for fade-in animations
  useEffect(() => {
    const sections = document.querySelectorAll(".fade-in-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <div className="h-screen flex flex-col font-inter">
      <Header />
      <main className="overflow-auto">
        <HeroSectionDemo />
        <div id="pricing">
          <Pricing />
        </div>
        <div id="faq">
          <FAQ />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Index;
