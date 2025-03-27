// In EmailConfirm.tsx
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const EmailConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(3);
  const searchParams = new URLSearchParams(location.search);
  const priceId = searchParams.get("priceId");
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !priceId) {
      console.log("userId or priceId not found! redirecting to login page...");
      navigate("/login");
      return;
    }

    console.log("PriceId: ", priceId);
    console.log("PriceId: ", user.id);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setTimeout(initiateCheckout, 3000);
        }
        return prev - 1;
      });
    }, 1000);

    const initiateCheckout = async () => {
      try {
        const stripe = await stripePromise;

        const { data: supabaseSession } = await supabase.auth.getSession();
        const token = supabaseSession?.session?.access_token;

        console.log("Token: ", token);

        if (!token) throw new Error("User not authenticated");

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URI}/api/create-checkout-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              priceId,
              userId: user.id,
            }),
          }
        );

        const session = await response.json();

        if (!session.id) {
          throw new Error("Session ID is missing in response");
        }

        const result = await stripe!.redirectToCheckout({
          sessionId: session.id,
        });
        if (result.error) {
          console.error(result.error.message);
          toast.error("Failed to redirect to payment page");
        }
      } catch (error) {
        console.error("Checkout error:", error);
        toast.error("Checkout failed. Please try again.");
      }
    };

    return () => clearInterval(timer);
  }, [user, priceId, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
        <div className="flex items-center justify-center mb-4">
          <CheckCircleIcon className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-3">
          Email confirmation successful.
        </h2>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Redirecting to payment in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirm;
