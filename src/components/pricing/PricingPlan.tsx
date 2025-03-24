import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

interface PricingPlanProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  buttonDisabled: boolean;
  priceId: string; // Add priceId prop
}

const PricingPlan: React.FC<PricingPlanProps> = ({
  name,
  price,
  description,
  features,
  isPopular = false,
  buttonText,
  buttonDisabled,
  priceId, // Destructure priceId
}) => {
  const { user } = useAuth();
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const handleCheckout = async () => {
    if (!user) {
      console.error("User not authenticated.");
      return;
    }
    if (buttonDisabled) return;

    const stripe = await stripePromise;

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URI}/api/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId: priceId, userId: user.id }),
      }
    );

    const session = await response.json();
    const result = await stripe!.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <Card
      className={`w-full md:px-4 border transition-transform duration-300 pb-10 ${
        isPopular
          ? "border-gray-500 md:pb-[80px] md:scale-105 z-10 px-3 bg-gray-100"
          : "relative"
      }`}
    >
      <CardHeader className="text-left">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{name}</CardTitle>
          {isPopular && (
            <Badge
              className="border border-gray-500 text-gray-500 bg-transparent rounded-md px-2 py-1"
              variant="outline"
            >
              Popular
            </Badge>
          )}
        </div>
        <div className="flex items-baseline text-3xl font-bold">
          ${price}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            / month
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <div className="px-4 flex flex-col">
        <Button
          className={`w-full rounded-full ${
            buttonDisabled ? "bg-gray-300 text-gray-600 cursor-not-allowed" : ""
          }`}
          disabled={buttonDisabled}
          onClick={handleCheckout} // Add onClick handler
        >
          {buttonText}
        </Button>
      </div>
      <CardContent className="space-y-2 p-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center text-sm">
            ✓ {feature}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PricingPlan;
