/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabaseClient";
import { Moon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

interface SettingsProps {
  onClose?: () => void;
}

const Settings: React.FC<SettingsProps> = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchSubscription = async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) console.error("Subscription fetch error:", error);
      else setSubscription(data);
    };

    const fetchCredits = async () => {
      const { data, error } = await supabase
        .from("user_credits")
        .select("credits_available")
        .eq("user_id", user.id)
        .single();

      if (error) console.error("Credits fetch error:", error);
      else setCredits(data?.credits_available);
    };

    fetchSubscription();
    fetchCredits();
  }, [user]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const addOneDay = (dateString: string) => {
    return new Date(new Date(dateString).getTime() + 86400000).toISOString();
  };

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | null;
  }) => (
    <div className="py-3 flex flex-col sm:flex-row sm:items-center border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-48">
        {label}
      </span>
      <span className="text-sm text-gray-900 dark:text-gray-200 font-mono">
        {value || "N/A"}
      </span>
    </div>
  );

  const isDarkMode = useMemo(() => theme === "dark", [theme]);

  const getAvatarFallback = () => {
    if (user?.user_metadata?.avatar_url) {
      return (
        <img
          src={user.user_metadata.avatar_url}
          alt="User Avatar"
          className="rounded-full h-14 w-14 object-cover border border-gray-200 shadow-sm"
        />
      );
    }
    const initials =
      user?.user_metadata?.name?.charAt(0) ||
      user?.user_metadata?.firstName?.charAt(0) ||
      user?.email?.charAt(0) ||
      "😊";
    return initials.toUpperCase();
  };

  const getUserDisplayName = () => {
    return (
      user?.user_metadata?.name ||
      `${user?.user_metadata?.firstName || ""} ${
        user?.user_metadata?.lastName || ""
      }`.trim() ||
      "N/A"
    );
  };

  return (
    <div className="sm:p-3 overflow-y-auto max-h-[80vh]">
      {user && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            ACCOUNT
          </h3>
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
            <Avatar className="h-14 w-14">
              {typeof getAvatarFallback() === "string" ? (
                <AvatarFallback className="bg-primary text-2xl font-medium text-white dark:text-gray-800">
                  {getAvatarFallback()}
                </AvatarFallback>
              ) : (
                getAvatarFallback()
              )}
            </Avatar>
            <div>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {getUserDisplayName()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          {/* ACCOUNT DETAILS */}
          <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Account Details
            </h4>
            <div className="space-y-1">
              <InfoRow label="User ID" value={user.id} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow
                label="Account Created"
                value={user.created_at ? formatDate(user.created_at) : null}
              />
              <InfoRow
                label="Email Confirmed"
                value={
                  user.email_confirmed_at
                    ? formatDate(user.email_confirmed_at)
                    : null
                }
              />
              <InfoRow
                label="Last Sign In"
                value={
                  user.last_sign_in_at ? formatDate(user.last_sign_in_at) : null
                }
              />
            </div>
          </div>

          {/* SUBSCRIPTION & CREDITS */}
          <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Subscription & Credits
            </h4>
            <div className="space-y-1">
              <InfoRow
                label="Subscription Plan"
                value={subscription?.plan || "Intern"}
              />
              <InfoRow
                label="Status"
                value={subscription?.status || "Active"}
              />
              <InfoRow
                label="Current Period Starts"
                value={
                  formatDate(subscription?.current_period_start) ||
                  user.created_at
                    ? formatDate(user.created_at)
                    : null
                }
              />
              <InfoRow
                label="Current Period Ends"
                value={
                  formatDate(subscription?.current_period_end) ||
                  (user.created_at
                    ? formatDate(addOneDay(user.created_at))
                    : null)
                }
              />
              <InfoRow
                label="Credits Limit"
                value={subscription?.credits_limit || "2"}
              />
              <InfoRow
                label="Available Credits"
                value={credits?.toString() || "0"}
              />
            </div>
          </div>
        </div>
      )}

      {/* APPEARANCE SETTINGS */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          APPEARANCE
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-gray-500" />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Dark mode
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Switch between light and dark theme
                </p>
              </div>
            </div>
            <Switch onCheckedChange={toggleTheme} defaultChecked={isDarkMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
