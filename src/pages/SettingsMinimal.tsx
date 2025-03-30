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
  const [tier, setTier] = useState<string>("-");
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setIsInitialLoading(false); // Set loading to false if no user
      return;
    }

    const fetchData = async () => {
      setIsInitialLoading(true);
      try {
        // Fetch subscription and credits in parallel
        const [subscriptionRes, creditsRes] = await Promise.all([
          supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .single(),
          supabase
            .from("user_credits")
            .select("credits_available")
            .eq("user_id", user.id)
            .single(),
        ]);

        if (subscriptionRes.error) {
          setTier("intern");
        } else {
          setSubscription(subscriptionRes.data);
          setTier(subscriptionRes.data?.plan || "intern");
        }

        if (!creditsRes.error) {
          setCredits(creditsRes.data?.credits_available || 0);
        }
      } catch (error) {
        console.error("Error fetching settings data:", error);
        setTier("intern");
        setCredits(0);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const formatTierName = (tier: string) => {
    return tier
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

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

      // Redirect to /chat and reload after short delay
      navigate("/chat");
      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      console.error("Error deleting chats:", error);
      toast.error("Failed to delete chats. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpgradePlan = async () => {
    if (!subscription?.stripe_subscription_id) {
      toast.error("No active subscription found.", {
        position: "bottom-center",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get the Supabase access token
      const { data: supabaseSession } = await supabase.auth.getSession();
      const token = supabaseSession?.session?.access_token;

      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/upgrade-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the authorization header
          },
          body: JSON.stringify({
            subscriptionId: subscription.stripe_subscription_id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upgrade subscription.");
      }
      const subscriptionData = await response.json();

      // Redirect user to the Stripe customer portal. 	The backend should return a URL.
      if (subscriptionData?.url) {
        window.open(subscriptionData.url, "_blank");
      } else {
        toast.error(
          "Could not retrieve upgrade management URL.	Please contact support.",
          { position: "bottom-center" }
        );
      }
    } catch (error: any) {
      console.error("Error upgrading subscription:", error);
      toast.error(
        error.message || "An error occurred while upgrading your subscription.",
        {
          position: "bottom-center",
        }
      );
    } finally {
      setIsLoading(false);
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
      // Get the Supabase access token
      const { data: supabaseSession } = await supabase.auth.getSession();
      const token = supabaseSession?.session?.access_token;

      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/manage-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the authorization header
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

      // Redirect user to the Stripe customer portal. 	The backend should return a URL.
      if (subscriptionData?.url) {
        window.open(subscriptionData.url, "_blank");
      } else {
        toast.error(
          "Could not retrieve subscription management URL. 	Please contact support.",
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

  if (isInitialLoading) {
    return (
      <div className="overflow-y-auto animate-pulse md:max-h-[80vh] max-w-md">
        {/* Header Skeleton */}
        <div className="header px-4 border-b">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        </div>

        {/* Body Skeleton */}
        <div className="body px-6 py-6 space-y-6">
          {/* Theme Section */}
          <div className="border-b pb-6 space-y-4">
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="border-b pb-6 space-y-4">
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>

          {/* Data & Privacy Section */}
          <div className="border-b pb-6 space-y-4">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="flex justify-between items-center">
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

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
            <span>{formatTierName(tier)}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[15px] text-gray-900 dark:text-white">
              Available credits
            </p>
            <span>{credits?.toString() || "0"}</span>
          </div>
          {/* <div className="mt-4">
            {tier.toLowerCase() === "intern" ? (
              <div className="flex justify-center">
                <Button
                  className="px-6 text-sm py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 
				 					disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() => setIsPricingOpen(true)}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Upgrade Plan"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                {tier.toLowerCase() === "equity_analyst" && (
                  <Button
                    className="flex-1 px-6 text-sm py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 
						 					disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:hover:bg-gray-800"
                    onClick={handleUpgradePlan}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Upgrade Plan"}
                  </Button>
                )}
                <Button
                  className={cn(
                    "px-6 text-sm py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "dark:bg-gray-700 dark:hover:bg-gray-600",
                    tier.toLowerCase() === "equity_analyst"
                      ? "flex-1"
                      : "w-max mx-auto"
                  )}
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Manage Subscription"}
                </Button>
              </div>
            )}
          </div> */}
          <div className="mt-4">
            {tier.toLowerCase() === "intern" ? (
              <div className="flex justify-center">
                <Button
                  className="px-6 text-sm py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 
				 					disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() => setIsPricingOpen(true)}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Upgrade Plan"}
                </Button>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button
                  className="px-6 text-sm py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 
                   disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Manage Subscription"}
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
