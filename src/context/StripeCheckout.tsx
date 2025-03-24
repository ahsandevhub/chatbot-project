import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "@supabase/auth-helpers-react";
import React from "react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CheckoutProps {
  priceId: string;
}

const Checkout: React.FC<CheckoutProps> = ({ priceId }) => {
  const user = useUser();

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const stripe = await stripePromise;
    if (!user?.id) {
      console.error("User ID is missing. Cannot proceed with checkout.");
      return;
    }

    const response = await fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId: priceId, userId: user.id }),
    });

    const session = await response.json();
    const result = await stripe!.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return <button onClick={handleClick}>Subscribe</button>;
};

export default Checkout;
