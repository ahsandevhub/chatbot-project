import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";
import PricingPlan from "./PricingPlan";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchCurrentPlan = async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .single();

      setCurrentPlan(data?.plan || "intern");
    };

    fetchCurrentPlan();
  }, [user]);

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
      buttonText: currentPlan === "intern" ? "Your current plan" : "Get Intern",
      buttonDisabled: currentPlan === "intern",
      priceId: "", // Free plan, no Stripe Price ID
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
      buttonText:
        currentPlan === "equity_analyst"
          ? "Your current plan"
          : "Get Equity Analyst",
      buttonDisabled: currentPlan === "equity_analyst",
      priceId: "price_1R5vFhC15A7InoP9bTVXGLxS", // Replace with your actual Price ID
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
      buttonText:
        currentPlan === "global_macro"
          ? "Your current plan"
          : "Get Global Macro",
      buttonDisabled: currentPlan === "global_macro",
      priceId: "price_1R6F3XC15A7InoP9X4zV8Ys1", // Replace with your actual Price ID
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl py-10">
        <DialogHeader className="text-left">
          <DialogTitle className="md:text-3xl text-2xl text-center">
            Upgrade your plan
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsContent
            value="personal"
            className="mt-4 sm:max-h-[80vh] max-h-[80vh] overflow-y-auto"
          >
            <div className="grid md:grid-cols-3 md:gap-0 gap-10 md:px-4 px-2 md:p-6 relative">
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
                  priceId={plan.priceId} // Add priceId prop
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
