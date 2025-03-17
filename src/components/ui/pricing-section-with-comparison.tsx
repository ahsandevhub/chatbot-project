"use client";

import { Check, Minus } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlanFeature {
  name: string;
  intern: string | boolean | React.ReactNode;
  equityAnalyst: string | boolean | React.ReactNode;
  globalMacro: string | boolean | React.ReactNode;
}

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

interface PricingTierProps {
  name: string;
  price: number;
  description: string;
  highlight?: boolean;
  action: {
    label: string;
    href: string;
  };
}

export function Pricing({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className={cn("py-16 md:py-24 lg:py-32 bg-gray-50 font-inter", className)}
      {...props}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <div className="inline-block bg-gray-800 text-white py-0.5 px-3 text-sm rounded-md font-medium">
              Pricing
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-inter">
            Prices that won't break the bank!
          </h2>
          <p className="mt-4 text-muted-foreground font-inter">
            Trading is hard. Accessing historical data shouldn't be.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-xl lg:max-w-4xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <PricingTier
              name="Intern"
              price={0}
              description="Ideal for anyone looking to dip their toes in the water and explore the capabilities of our AI Assistant."
              action={{
                label: "Sign Up",
                href: "#",
              }}
            />
            <PricingTier
              name="Equity Analyst"
              price={6.99}
              highlight
              description="The go-to plan for traders who need historical intraday stock data from the world's largest stock exchanges."
              action={{
                label: "Sign Up",
                href: "#",
              }}
            />
            <PricingTier
              name="Global Macro"
              price={13.99}
              description="Our full-fledged plan for traders who need access to the entire enchilada."
              action={{
                label: "Sign Up",
                href: "#",
              }}
            />
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-6xl overflow-x-auto">
          <div className="min-w-max">
            <div className="grid grid-cols-4 gap-8 py-4 border-b border-gray-200">
              <div className="text-lg font-semibold">Features</div>
              <div className="text-center">Intern</div>
              <div className="text-center">Equity Analyst</div>
              <div className="text-center">Global Macro</div>
            </div>
            {features.map((feature, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-8 py-4 border-b border-gray-200"
              >
                <div>{feature.name}</div>
                <div className="flex justify-center">
                  {typeof feature.intern === "boolean" ? (
                    feature.intern ? (
                      <Check className="h-5 w-5 text-primary" />
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
                      <Check className="h-5 w-5 text-primary" />
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
                      <Check className="h-5 w-5 text-primary" />
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
    </section>
  );
}

function PricingTier({
  name,
  price,
  description,
  highlight,
  action,
}: PricingTierProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-gray-200 p-8 transition-all duration-300 hover:border-gray-300 hover:shadow-md bg-white",
        highlight && "border-primary"
      )}
    >
      <h3 className="text-2xl font-bold mb-3">{name}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="flex items-end mb-6">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-gray-500 ml-1">/ month</span>
      </div>
      <Button
        className="w-full mb-8"
        variant={highlight ? "default" : "outline"}
      >
        <a href={action.href}>{action.label}</a>
      </Button>
    </div>
  );
}
