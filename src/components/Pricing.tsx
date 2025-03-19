import { Button } from "@/components/ui/button";
import { Check, Minus } from "lucide-react";
import React, { useEffect, useRef } from "react";

type PlanFeature = {
  name: string;
  intern: string | boolean | React.ReactNode;
  equityAnalyst: string | boolean | React.ReactNode;
  globalMacro: string | boolean | React.ReactNode;
};

const features: PlanFeature[] = [
  {
    name: "Credit Limits",
    intern: "2 credits per day",
    equityAnalyst: "1,000 credits per month",
    globalMacro: "5,000 credits per month",
  },
  {
    name: "Asset Classes",
    intern: "Equities",
    equityAnalyst: "Equities",
    globalMacro: "Equities, Crypto, Forex",
  },
  {
    name: "Stock Exchanges",
    intern: "NASDAQ, NYSE",
    equityAnalyst: "Top 5",
    globalMacro: "Top 10",
  },
  {
    name: "Extended Trading Hours",
    intern: "-",
    equityAnalyst: <Check className="h-5 w-5 text-black" />,
    globalMacro: <Check className="h-5 w-5 text-black" />,
  },
  {
    name: "Historical Data",
    intern: "1 year",
    equityAnalyst: "3 years",
    globalMacro: "5 years",
  },
  {
    name: "Intraday Data",
    intern: "-",
    equityAnalyst: <Check className="h-5 w-5 text-black" />,
    globalMacro: <Check className="h-5 w-5 text-black" />,
  },
];

const Pricing: React.FC = () => {
  const pricingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      },
      { threshold: 0.1 }
    );

    if (pricingRef.current) {
      observer.observe(pricingRef.current);
    }

    return () => {
      if (pricingRef.current) {
        observer.unobserve(pricingRef.current);
      }
    };
  }, []);

  return (
    <section className="py-24 bg-gray-50" id="pricing">
      <div className="container px-4 md:px-6">
        <div ref={pricingRef} className="fade-in-section">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-black text-white py-1 px-4 rounded-md font-medium">
                Pricing
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-inter">
              Prices that won't break the bank!
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-inter">
              Trading is hard. Accessing historical data shouldn't be.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Intern Plan */}
            <div className="pricing-card bg-white animate-fade-in [animation-delay:100ms]">
              <h3 className="text-2xl font-bold mb-3 font-inter">Intern</h3>
              <p className="text-gray-600 mb-6 font-inter">
                Ideal for anyone looking to dip their toes in the water and
                explore the capabilities of our AI Assistant.
              </p>
              <div className="flex items-end mb-6 font-inter">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500 ml-1">/ month</span>
              </div>
              <Button
                variant="outline"
                className="w-full mb-8 button-hover-effect font-inter"
              >
                Sign Up
              </Button>
            </div>

            {/* Equity Analyst Plan */}
            <div className="pricing-card pricing-card-highlight bg-white animate-fade-in [animation-delay:200ms]">
              <h3 className="text-2xl font-bold mb-3 font-inter">
                Equity Analyst
              </h3>
              <p className="text-gray-600 mb-6 font-inter">
                The go-to plan for traders who need historical intraday stock
                data from the world's largest stock exchanges.
              </p>
              <div className="flex items-end mb-6 font-inter">
                <span className="text-4xl font-bold">$6.99</span>
                <span className="text-gray-500 ml-1">/ month</span>
              </div>
              <Button className="w-full mb-8 bg-black hover:bg-black/90 button-hover-effect font-inter">
                Sign Up
              </Button>
            </div>

            {/* Global Macro Plan */}
            <div className="pricing-card bg-white animate-fade-in [animation-delay:300ms]">
              <h3 className="text-2xl font-bold mb-3 font-inter">
                Global Macro
              </h3>
              <p className="text-gray-600 mb-6 font-inter">
                Our full-fledged plan for traders who need access to the entire
                enchilada.
              </p>
              <div className="flex items-end mb-6 font-inter">
                <span className="text-4xl font-bold">$13.99</span>
                <span className="text-gray-500 ml-1">/ month</span>
              </div>
              <Button
                variant="outline"
                className="w-full mb-8 button-hover-effect font-inter"
              >
                Sign Up
              </Button>
            </div>
          </div>

          {/* Features Table */}
          <div className="mt-16 max-w-6xl mx-auto overflow-x-auto">
            <div className="min-w-max">
              <div className="grid grid-cols-4 gap-8 py-4 border-b border-gray-200 font-inter">
                <div className="text-lg font-semibold">Features</div>
                <div className="text-center">Intern</div>
                <div className="text-center">Equity Analyst</div>
                <div className="text-center">Global Macro</div>
              </div>

              {features.map((feature, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-8 py-4 border-b border-gray-200 font-inter"
                >
                  <div>{feature.name}</div>
                  <div className="flex justify-center">
                    {typeof feature.intern === "boolean" ? (
                      feature.intern ? (
                        <Check className="h-5 w-5 text-black" />
                      ) : (
                        <Minus className="h-5 w-5 text-gray-400" />
                      )
                    ) : (
                      feature.intern
                    )}
                  </div>
                  <div className="flex justify-center">
                    {typeof feature.equityAnalyst === "boolean" ? (
                      feature.equityAnalyst ? (
                        <Check className="h-5 w-5 text-black" />
                      ) : (
                        <Minus className="h-5 w-5 text-gray-400" />
                      )
                    ) : (
                      feature.equityAnalyst
                    )}
                  </div>
                  <div className="flex justify-center">
                    {typeof feature.globalMacro === "boolean" ? (
                      feature.globalMacro ? (
                        <Check className="h-5 w-5 text-black" />
                      ) : (
                        <Minus className="h-5 w-5 text-gray-400" />
                      )
                    ) : (
                      feature.globalMacro
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
