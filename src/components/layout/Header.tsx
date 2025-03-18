import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PanelLeft } from "lucide-react";
import React from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import { ThemeToggle } from "../ui/ThemeToggle";
import UserMenu from "./UserMenu";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { id } = useParams<{ id: string }>();
  const { conversations } = useChat();

  const currentConversation = conversations.find((conv) => conv.id === id);

  return (
    <div className="flex items-center justify-between h-14 border-b border-border px-4 flex-shrink-0">
      <div className="flex items-center">
        {!isSidebarOpen && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  className="mr-2 p-2 rounded-md hover:bg-accent transition-colors"
                >
                  <PanelLeft size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Open sidebar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex-1 max-w-screen-md mx-auto flex items-center justify-center">
        {currentConversation && (
          <h1 className="text-sm font-medium">{currentConversation.title}</h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </div>
  );
};

export default Header;
