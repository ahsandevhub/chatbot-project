import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Moon } from "lucide-react";
import React, { useMemo } from "react";

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return "N/A";
    }
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.charAt(0).toUpperCase();
    }
    if (user?.user_metadata?.firstName) {
      return user.user_metadata.firstName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "😊";
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

  const getUserDisplayName = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.user_metadata?.firstName && user?.user_metadata?.lastName) {
      return `${user.user_metadata.firstName} ${user.user_metadata.lastName}`;
    }
    if (user?.user_metadata?.firstName) {
      return user.user_metadata.firstName;
    }
    return "N/A";
  };

  const isDarkMode = useMemo(() => theme === "dark", [theme]);

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
              {user.phone && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {user.phone}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Account Details
            </h4>
            <div className="space-y-1">
              <InfoRow label="User ID" value={user.id} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Phone" value={user.phone} />
              {/* <InfoRow label="Instance ID" value={user.instance_id} /> */}
              <InfoRow label="Audience" value={user.aud} />
              <InfoRow label="Role" value={user.role} />
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
        </div>
      )}

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

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
};

export default Settings;
