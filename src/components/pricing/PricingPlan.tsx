
import React from "react";
import { Check, Minus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlanFeature {
  name: string;
  value: string | boolean;
}

interface PricingPlanProps {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  isPopular?: boolean;
  onClick?: () => void;
}

const PricingPlan: React.FC<PricingPlanProps> = ({
  name,
  price,
  description,
  features,
  isPopular = false,
  onClick
}) => {
  return (
    <Card className={`w-full ${isPopular ? 'border-primary shadow-md' : ''}`}>
      <CardHeader className="space-y-1">
        {isPopular && (
          <Badge className="w-fit mb-2" variant="default">
            Popular
          </Badge>
        )}
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="flex items-baseline text-3xl font-bold">
          ${price}
          <span className="ml-1 text-sm font-normal text-muted-foreground">/month</span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              {typeof feature.value === "boolean" ? (
                feature.value ? (
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                ) : (
                  <Minus className="mr-2 h-4 w-4 text-gray-300" />
                )
              ) : (
                <span className="mr-2 h-4 w-4 flex items-center justify-center"></span>
              )}
              <div className="flex justify-between w-full">
                <span className="text-sm">{feature.name}</span>
                {typeof feature.value !== "boolean" && (
                  <span className="text-sm font-medium">{feature.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant={isPopular ? "default" : "outline"} className="w-full" onClick={onClick}>
          Sign Up
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingPlan;
