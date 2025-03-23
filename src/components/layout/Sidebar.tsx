/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext"; // Import the AuthContext
import { useTheme } from "@/context/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/lib/supabaseClient"; // Import your Supabase client
import { cn } from "@/lib/utils";
import {
  Check,
  MessageSquarePlus,
  MoreHorizontal,
  PanelLeftClose,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import PricingModal from "../pricing/PricingModal";

const groupConversationsByDate = (chats: any[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const groups: Record<string, any[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    "Previous 30 Days": [],
  };

  chats.forEach((chat) => {
    const chatDate = new Date(chat.created_at);
    chatDate.setHours(0, 0, 0, 0);

    if (chatDate.getTime() === today.getTime()) {
      groups["Today"].push(chat);
    } else if (chatDate.getTime() === yesterday.getTime()) {
      groups["Yesterday"].push(chat);
    } else if (chatDate >= oneWeekAgo && chatDate < today) {
      groups["Previous 7 Days"].push(chat);
    } else if (chatDate < oneWeekAgo) {
      groups["Previous 30 Days"].push(chat);
    }
  });

  return groups;
};

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const {
    chats,
    currentChatId,
    setCurrentChatId,
    addChat,
    deleteChat,
    renameChat,
  } = useChat();
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const groupedChats = useMemo(() => groupConversationsByDate(chats), [chats]);
  const hasChats = chats && chats.length > 0;

  const handleNewChat = async () => {
    const newId = await addChat("New Chat");
    setCurrentChatId(newId);
    navigate(`/chat/${newId}`);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleStartEditing = (
    id: string,
    currentTitle: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setEditingChatId(id);
    setEditingName(currentTitle);
  };

  const handleSaveEdit = (id: string) => {
    if (editingName.trim()) {
      renameChat(id, editingName.trim());
    }
    setEditingChatId(null);
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      handleSaveEdit(id);
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleChatClick = (id: string) => {
    setCurrentChatId(id);
    if (isMobile) {
      toggleSidebar();
    }
    navigate(`/chat/${id}`);
  };

  useEffect(() => {
    if (!user) {
      setLoadingPlan(false);
      return;
    }

    const fetchUserPlan = async () => {
      setLoadingPlan(true);
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("plan")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching subscription:", error);
          setUserPlan("intern");
        } else {
          setUserPlan(data?.plan || "intern");
        }
      } catch (error) {
        console.error("Error fetching user plan:", error);
        setUserPlan("intern");
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchUserPlan();
  }, [user]);

  return (
    <aside
      className={cn(
        "fixed top-0 bottom-0 left-0 flex flex-col h-full bg-background text-foreground transition-transform duration-300 ease-in-out z-20 border-r border-border",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        isMobile ? "w-full" : "w-[260px]"
      )}
    >
      <div className="flex-shrink-0 p-2 flex items-center justify-between h-14 border-b border-border">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-accent transition-colors"
              >
                <PanelLeftClose size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Close sidebar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleNewChat}
                className="p-2 rounded-md hover:bg-accent transition-colors"
              >
                <MessageSquarePlus size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>New chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="py-2 px-2 space-y-5">
            {hasChats ? (
              Object.entries(groupedChats).map(([group, groupChats]) =>
                groupChats.length > 0 ? (
                  <div key={group} className="space-y-1">
                    <h3 className="px-3 text-xs font-medium text-muted-foreground mb-2">
                      {group}
                    </h3>
                    <div className="space-y-1">
                      {groupChats.map((chat) => (
                        <div
                          key={chat.id}
                          className={cn(
                            "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors duration-200 hover:bg-accent",
                            currentChatId === chat.id ? "bg-accent" : ""
                          )}
                          onMouseEnter={() => setHoveredChat(chat.id)}
                          onMouseLeave={() =>
                            setHoveredChat(
                              chat.id === editingChatId ? chat.id : null
                            )
                          }
                          onClick={() => handleChatClick(chat.id)}
                        >
                          {editingChatId === chat.id ? (
                            <div className="flex items-center gap-1 flex-1">
                              <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => handleEditKeyDown(e, chat.id)}
                                className="h-7 py-1 flex-1"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveEdit(chat.id)}
                                className="p-1 text-green-600 hover:bg-accent rounded"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1 text-red-600 hover:bg-accent rounded"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Link
                                to={`/chat/${chat.id}`}
                                className="flex-1 truncate"
                                onClick={() => handleChatClick(chat.id)}
                              >
                                <span className="truncate">{chat.title}</span>
                              </Link>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    className={cn(
                                      "p-1 hover:bg-accent rounded opacity-0 transition-opacity duration-200",
                                      hoveredChat === chat.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal size={16} />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleStartEditing(chat.id, chat.title, e)
                                    }
                                  >
                                    <Pencil size={16} className="mr-2" />
                                    Rename
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => deleteChat(chat.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              )
            ) : (
              <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                No conversations yet. Start a new chat!
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {loadingPlan ? (
        <div className="flex-shrink-0 p-3 border-t border-border flex justify-center items-center">
          Loading Plan...
        </div>
      ) : userPlan === "intern" ? (
        <div className="flex-shrink-0 p-3 border-t border-border">
          <button
            onClick={() => setIsPricingOpen(true)}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-md",
              theme === "dark"
                ? "bg-white hover:bg-white/90 text-gray-900"
                : "bg-gray-900 hover:bg-gray-800 text-white",
              "transition-colors duration-200 py-2 px-3 text-sm"
            )}
          >
            <span>Upgrade Plan</span>
          </button>
        </div>
      ) : (
        <div className="flex-shrink-0 p-3 border-t border-border flex justify-center items-center">
          {theme === "dark" ? (
            <img src="/logo-wh.svg" alt="Company Logo Dark" className="h-8" />
          ) : (
            <img src="/logo.svg" alt="Company Logo Light" className="h-8" />
          )}
        </div>
      )}

      <PricingModal open={isPricingOpen} onOpenChange={setIsPricingOpen} />
    </aside>
  );
};

export default Sidebar;
