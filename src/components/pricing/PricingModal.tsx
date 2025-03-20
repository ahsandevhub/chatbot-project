import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import React from "react";
import PricingPlan from "./PricingPlan";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ open, onOpenChange }) => {
  const plans = [
    {
      name: "Intern",
      price: "0",
      description: "Ideal for Beginners",
      features: [
        "Access to NASDAQ",
        "Access to the New York Stock Exchange (NYSE)",
        "Timeframes: Daily, Weekly, and Monthly",
        "Up to 1 year of data",
      ],
      isPopular: false,
      buttonText: "Your current plan",
      buttonDisabled: true,
    },
    {
      name: "Equity Analyst",
      price: "6.99",
      description: "Ideal for Stock Traders",
      features: [
        "Everything in Intern",
        "Access to the Shanghai Stock Exchange (SSE)",
        "Access to the Tokyo Stock Exchange (TSE)",
        "Access to the National Stock Exchange of India (NSE)",
        "Additional Timeframes: 1m, 5m, 15m, 30m, 45m, 1H, 2H, and 4H",
        "Up to 3 years of data",
      ],
      isPopular: true,
      buttonText: "Get Equity Analyst",
      buttonDisabled: false,
    },
    {
      name: "Global Macro",
      price: "13.99",
      description: "Ideal for Traders who trade all markets",
      features: [
        "Everything in Equity Analyst",
        "Access to 5 additional Exchanges (Euronext, HKEX, SZSE, TSX, and Tadawul)",
        "Access to Crypto & Forex data",
        "Up to 5 years of data",
      ],
      isPopular: false,
      buttonText: "Get Global Macro",
      buttonDisabled: false,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl py-10">
        <DialogHeader className="text-left">
          <DialogTitle className="text-3xl text-center">
            Upgrade your plan
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsContent
            value="personal"
            className="mt-4 sm:max-h-[60vh] max-h-[70vh] overflow-y-auto"
          >
            <div className="grid md:grid-cols-3 gap-0 px-4 sm:p-6 relative">
              {plans.map((plan) => (
                <PricingPlan
                  key={plan.name}
                  name={plan.name}
                  price={plan.price}
                  description={plan.description}
                  features={plan.features}
                  isPopular={plan.isPopular}
                  buttonText={plan.buttonText}
                  buttonDisabled={plan.buttonDisabled}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
