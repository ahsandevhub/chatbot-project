/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import {
  Check,
  MessageSquarePlus,
  MoreHorizontal,
  PanelLeftClose,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import PricingModal from "../pricing/PricingModal";

const sortChatsByDate = (chats: any[]) => {
  return [...chats].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleChats, setVisibleChats] = useState(30);
  const [allChats, setAllChats] = useState<any[]>([]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sort chats by date
  useEffect(() => {
    if (chats) {
      const sorted = sortChatsByDate(chats);
      setAllChats(sorted);
    }
  }, [chats]);

  // Group only the visible chats
  const groupedChats = useMemo(() => {
    return groupConversationsByDate(allChats.slice(0, visibleChats));
  }, [allChats, visibleChats]);

  // Handle scroll events
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;

      if (isNearBottom && !loadingMore && visibleChats < allChats.length) {
        setLoadingMore(true);

        setTimeout(() => {
          setVisibleChats((prev) => Math.min(prev + 30, allChats.length));
          setLoadingMore(false);
        }, 1500);
      }
    };

    viewport.addEventListener("scroll", handleScroll);
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [allChats.length, loadingMore, visibleChats]);

  // Reset visible chats when sidebar is opened
  useEffect(() => {
    if (isSidebarOpen) {
      setVisibleChats(30);
    }
  }, [isSidebarOpen]);

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
      setUserPlan("intern");
      setIsLoading(false); // Add this line
      return;
    }

    const fetchUserPlan = async () => {
      setLoadingPlan(true);
      setIsLoading(true); // Add this line
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("plan")
          .eq("user_id", user.id)
          .single();

        if (error) {
          setUserPlan("intern");
        } else {
          setUserPlan(data?.plan || "intern");
        }
      } catch (error) {
        setUserPlan("intern");
      } finally {
        setLoadingPlan(false);
        setIsLoading(false); // Add this line
      }
    };

    fetchUserPlan();
  }, [user]);

  if (isLoading) {
    return (
      <aside
        className={cn(
          "fixed animate-pulse top-0 bottom-0 left-0 flex flex-col h-full bg-background text-foreground transition-transform z-20 border-r border-border",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          isMobile ? "w-full" : "w-[260px]"
        )}
      >
        {/* Header Skeleton */}
        <div className="flex-shrink-0 p-2 flex items-center justify-between h-14 border-b border-border">
          <div className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 h-7 w-7"></div>
          <div className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 h-7 w-7"></div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="py-2 px-2 space-y-5">
            {/* Date Group Skeleton */}
            {[1, 2, 3].map((group) => (
              <div key={group} className="space-y-1">
                <div className="px-3 h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="space-y-1">
                  {/* Chat Item Skeletons */}
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-md px-3 py-2"
                    >
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Skeleton */}
        {/* <div className="flex-shrink-0 p-3 border-t border-border">
          <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div> */}
      </aside>
    );
  }

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
        <ScrollAreaPrimitive.Root className="h-full">
          <ScrollAreaPrimitive.Viewport ref={viewportRef} className="h-full">
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
                                  onChange={(e) =>
                                    setEditingName(e.target.value)
                                  }
                                  onKeyDown={(e) =>
                                    handleEditKeyDown(e, chat.id)
                                  }
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
                                        handleStartEditing(
                                          chat.id,
                                          chat.title,
                                          e
                                        )
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

              {loadingMore && (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                </div>
              )}

              {visibleChats < allChats.length && !loadingMore && (
                <div className="h-1" />
              )}
            </div>
          </ScrollAreaPrimitive.Viewport>
          <ScrollAreaPrimitive.Scrollbar orientation="vertical">
            <ScrollAreaPrimitive.Thumb />
          </ScrollAreaPrimitive.Scrollbar>
        </ScrollAreaPrimitive.Root>
      </div>

      {!loadingPlan && userPlan === "intern" ? (
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
