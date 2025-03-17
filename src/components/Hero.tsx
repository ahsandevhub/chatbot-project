
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import AppMockup from './AppMockup';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <section className="py-24 md:py-32 overflow-hidden" id="hero">
      <div className="container px-4 md:px-6">
        <div 
          ref={heroRef} 
          className="flex flex-col items-center text-center fade-in-section max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
            AI that works for you.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl animate-fade-in [animation-delay:200ms]">
            Transform your workflow with intelligent automation. Simple, powerful, reliable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in [animation-delay:400ms] mb-12">
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-base button-hover-effect"
            >
              Try Demo
            </Button>
            <Button 
              size="lg" 
              className="px-8 py-6 text-base bg-black hover:bg-black/90 button-hover-effect"
            >
              Start Free
            </Button>
          </div>
          
          {/* App Mockup - added below the buttons with animation */}
          <div className="w-full animate-fade-in [animation-delay:600ms]">
            <AppMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
