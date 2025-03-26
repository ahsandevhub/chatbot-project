import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import React, { useState } from "react";

interface PricingPlanProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  buttonDisabled: boolean;
  priceId: string;
}

const PricingPlan: React.FC<PricingPlanProps> = ({
  name,
  price,
  description,
  features,
  isPopular = false,
  buttonText,
  buttonDisabled,
  priceId,
}) => {
  const { user } = useAuth();
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user || buttonDisabled || isLoading) return;
    setIsLoading(true);

    try {
      const stripe = await stripePromise;

      // 1. Retrieve the JWT from storage (e.g., localStorage)
      const token = localStorage.getItem("jwtToken"); // Or wherever you store it

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 2. Add the JWT to the Authorization header
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ priceId: priceId, userId: user.id }),
        }
      );

      if (!response.ok) {
        // Handle non-2xx responses (e.g., 401, 403)
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const session = await response.json();
      const result = await stripe!.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
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
          className={`w-full rounded-full flex justify-center items-center ${
            buttonDisabled || isLoading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : ""
          }`}
          disabled={buttonDisabled || isLoading}
          onClick={handleCheckout}
        >
          {isLoading ? "Processing..." : buttonText}
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
