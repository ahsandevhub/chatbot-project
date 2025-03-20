import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import Settings from "@/pages/Settings";
import { LogOut } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Modal from "../ui/Modal";

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State for modal visibility

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully!", {
      position: "bottom-center",
    });
  };

  const getAvatarFallback = () => {
    if (user && user.user_metadata && user.user_metadata.avatar_url) {
      return (
        <img
          src={user.user_metadata.avatar_url}
          alt="User Avatar"
          className="rounded-full h-8 w-8 object-cover"
        />
      );
    }

    if (user && user.user_metadata && user.user_metadata.firstName) {
      return user.user_metadata.firstName.charAt(0).toUpperCase();
    }

    if (user && user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
          <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
            {typeof getAvatarFallback() === "string" ? (
              <AvatarFallback className="bg-primary dark:bg-gray-50 text-primary-foreground">
                {getAvatarFallback()}
              </AvatarFallback>
            ) : (
              getAvatarFallback()
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-md"
      >
        <DropdownMenuItem
          onClick={handleOpenSettings}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="border-gray-200 dark:border-gray-700" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <LogOut className="mr-2 h-4 w-4 text-gray-700 dark:text-gray-300" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Modal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        title="Settings"
        description="Manage your account settings and preferences."
      >
        <Settings onClose={handleCloseSettings} />
      </Modal>
    </DropdownMenu>
  );
};

export default UserMenu;
