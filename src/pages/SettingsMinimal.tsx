/* eslint-disable @typescript-eslint/no-explicit-any */
import PricingModal from "@/components/pricing/PricingModal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SettingsProps {
  onClose?: () => void;
}

const Settings: React.FC<SettingsProps> = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [subscription, setSubscription] = useState<any>(null);
  const [tier, setTier] = useState<string>("Intern");
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchSubscription = async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        return;
      }

      setSubscription(data);

      if (data) {
        setTier(data.plan || "Intern");
      } else {
        setTier("Intern");
      }
    };

    const fetchCredits = async () => {
      const { data, error } = await supabase
        .from("user_credits")
        .select("credits_available")
        .eq("user_id", user.id)
        .single();

      if (error) {
        return; // Exit on error
      }
      setCredits(data?.credits_available || 0); // Ensure credits is always a number, default to 0
    };

    fetchSubscription();
    fetchCredits();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully!", {
      position: "bottom-center",
    });
  };

  const handleDeleteAllChats = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("chats")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("All chats deleted successfully!", {
        position: "bottom-center",
      });

      // Redirect to /chats after successful deletion
      navigate("/chats");
    } catch (error) {
      console.error("Error deleting chats:", error);
      toast.error("Failed to delete chats. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!subscription?.stripe_subscription_id) {
      toast.error("No active subscription found.", {
        position: "bottom-center",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/manage-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscriptionId: subscription.stripe_subscription_id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to manage subscription.");
      }
      const subscriptionData = await response.json();

      // Redirect user to the Stripe customer portal.  The backend should return a URL.
      if (subscriptionData?.url) {
        window.open(subscriptionData.url, "_blank");
      } else {
        toast.error(
          "Could not retrieve subscription management URL.  Please contact support.",
          { position: "bottom-center" }
        );
      }
    } catch (error: any) {
      console.error("Error managing subscription:", error);
      toast.error(
        error.message || "An error occurred while managing your subscription.",
        {
          position: "bottom-center",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.stripe_subscription_id) {
      toast.error("No active subscription to cancel.", {
        position: "bottom-center",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/cancel-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscriptionId: subscription.stripe_subscription_id,
            userId: user!.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel subscription.");
      }

      const result = await response.json();
      toast.success(result.message, { position: "bottom-center" });
      // Optionally, update the UI to reflect the cancellation
      setSubscription({ ...subscription, status: "cancel_at_period_end" });
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showUpgradeButton = tier.toLowerCase() === "intern";

  return (
    <div className="overflow-y-auto md:max-h-[80vh] max-w-md">
      <div className="header px-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Settings
        </h2>
      </div>

      <div className="body px-6 py-6">
        <div className="mb-6 border-b pb-6">
          <h3 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-400">
            Theme
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-gray-900 dark:text-white">
              Dark mode
            </span>
            <Switch
              onCheckedChange={toggleTheme}
              defaultChecked={theme === "dark"}
            />
          </div>
        </div>

        <div className="mb-6 border-b pb-6">
          <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-400">
            Subscription
          </h3>
          <div className="flex justify-between items-center">
            <p className="text-[15px] mb-2 text-gray-900 dark:text-white">
              Current Plan
            </p>
            <span>{tier}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[15px] text-gray-900 dark:text-white">
              Available credits
            </p>
            <span>{credits?.toString() || "0"}</span>
          </div>
          <div className="mt-4 space-y-2 flex justify-center">
            {showUpgradeButton && (
              <Button
                className="px-6 text-sm py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setIsPricingOpen(true)}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Upgrade Plan"}
              </Button>
            )}
            {subscription && (
              <div className="flex flex-col space-y-2 mt-4">
                <Button
                  className="px-6 text-sm py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Manage Subscription"}
                </Button>
                <Button
                  className="px-6 text-sm py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCancelSubscription}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Cancel Subscription"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 border-b pb-6">
          <h3 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-400">
            Data & Privacy
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-gray-900 dark:text-white">
              Delete all chats
            </span>
            <button
              onClick={handleDeleteAllChats}
              disabled={isDeleting}
              className={cn(
                "px-4 text-sm py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              {isDeleting ? "Deleting..." : "Delete all"}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[15px] text-gray-900 dark:text-white">
            Log out on this device
          </span>
          <button
            onClick={handleLogout}
            className="px-4 text-sm py-2 bg-gray-100 border dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Log out
          </button>
        </div>
      </div>
      <PricingModal open={isPricingOpen} onOpenChange={setIsPricingOpen} />
    </div>
  );
};

export default Settings;
