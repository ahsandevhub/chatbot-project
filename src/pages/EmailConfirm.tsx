import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircleIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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

  const handleStripeCheckout = useCallback(
    async (userId: string) => {
      if (!priceId) {
        toast.error("Missing priceId");
        navigate("/login");
        return;
      }

      const stripe = await stripePromise;

      try {
        const { data: supabaseSession } = await supabase.auth.getSession();
        const token = supabaseSession?.session?.access_token;

        if (!token) {
          toast.error("Please log in to continue");
          navigate("/login");
          return;
        }

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
              userId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

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
    },
    [priceId, navigate]
  );

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (countdown > 0) return;

    if (!user || !priceId) {
      navigate("/login");
      return;
    }

    handleStripeCheckout(user.id);
  }, [countdown, user, priceId, navigate, handleStripeCheckout]);

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
