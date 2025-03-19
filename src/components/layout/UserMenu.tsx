import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Settings } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSettings = () => {
    navigate("/settings");
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully!", {
      position: "top-center",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
          <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarFallback className="bg-primary dark:bg-gray-50 text-primary-foreground">
              U
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-md"
      >
        <DropdownMenuItem
          onClick={handleSettings}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Settings className="mr-2 h-4 w-4 text-gray-700 dark:text-gray-300" />
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
    </DropdownMenu>
  );
};

export default UserMenu;
