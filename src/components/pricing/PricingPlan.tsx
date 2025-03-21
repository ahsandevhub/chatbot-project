import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface PricingPlanProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  buttonDisabled: boolean;
}

const PricingPlan: React.FC<PricingPlanProps> = ({
  name,
  price,
  description,
  features,
  isPopular = false,
  buttonText,
  buttonDisabled,
}) => {
  return (
    <Card
      className={`w-full px-4 border transition-transform duration-300 ${
        isPopular
          ? "border-gray-500 pb-6 scale-105 z-10 px-3 bg-gray-100"
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
