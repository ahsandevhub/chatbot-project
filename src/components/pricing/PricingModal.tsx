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
      description:
        "Ideal for anyone looking to dip their toes in the water and explore the capabilities of our AI Assistant.",
      features: [
        { name: "Credit Limits", value: "2 credits per day" },
        { name: "Asset Classes", value: "Equities" },
        { name: "Stock Exchanges", value: "NASDAQ, NYSE" },
        { name: "Extended Trading Hours", value: false },
        { name: "Historical Data", value: "1 year" },
        { name: "Intraday Data", value: false },
      ],
      isPopular: false,
    },
    {
      name: "Equity Analyst",
      price: "6.99",
      description:
        "The go-to plan for traders who need historical intraday stock data from the world's largest stock exchanges.",
      features: [
        { name: "Credit Limits", value: "1,000 credits per month" },
        { name: "Asset Classes", value: "Equities" },
        { name: "Stock Exchanges", value: "Top 5" },
        { name: "Extended Trading Hours", value: true },
        { name: "Historical Data", value: "3 years" },
        { name: "Intraday Data", value: true },
      ],
      isPopular: true,
    },
    {
      name: "Global Macro",
      price: "13.99",
      description:
        "Our full-fledged plan for traders who need access to the entire enchilada.",
      features: [
        { name: "Credit Limits", value: "5,000 credits per month" },
        { name: "Asset Classes", value: "Equities, Crypto, Forex" },
        { name: "Stock Exchanges", value: "Top 10" },
        { name: "Extended Trading Hours", value: true },
        { name: "Historical Data", value: "5 years" },
        { name: "Intraday Data", value: true },
      ],
      isPopular: false,
    },
  ];

  const handleSignUp = (planName: string) => {
    console.log(`Signed up for ${planName} plan`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader className="sm:p-6 sm:pb-2">
          <DialogTitle className="text-2xl text-center">
            Upgrade your plan
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsContent
            value="personal"
            className="mt-4 sm:max-h-[60vh] max-h-[70vh] overflow-y-auto"
          >
            <div className="grid md:grid-cols-3 gap-6 sm:p-6 px-4 sm:pt-0 pt-0">
              {plans.map((plan) => (
                <PricingPlan
                  key={plan.name}
                  name={plan.name}
                  price={plan.price}
                  description={plan.description}
                  features={plan.features}
                  isPopular={plan.isPopular}
                  onClick={() => handleSignUp(plan.name)}
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
