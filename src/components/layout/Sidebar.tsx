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
import { useTheme } from "@/context/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Check,
  MessageSquarePlus,
  MoreHorizontal,
  PanelLeftClose,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import PricingModal from "../pricing/PricingModal";

const groupConversationsByDate = (conversations: any[]) => {
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

  conversations.forEach((conversation) => {
    const convoDate = new Date(conversation.date);
    convoDate.setHours(0, 0, 0, 0);

    if (convoDate.getTime() === today.getTime()) {
      groups["Today"].push(conversation);
    } else if (convoDate.getTime() === yesterday.getTime()) {
      groups["Yesterday"].push(conversation);
    } else if (convoDate >= oneWeekAgo && convoDate < today) {
      groups["Previous 7 Days"].push(conversation);
    } else if (convoDate < oneWeekAgo) {
      groups["Previous 30 Days"].push(conversation);
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
    conversations,
    currentConversationId,
    setCurrentConversationId,
    addConversation,
    deleteConversation,
    renameConversation,
  } = useChat();
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [editingConversationId, setEditingConversationId] = useState<
    string | null
  >(null);
  const [editingName, setEditingName] = useState("");
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  const groupedConversations = useMemo(
    () => groupConversationsByDate(conversations),
    [conversations]
  );
  const hasConversations = conversations && conversations.length > 0;

  const handleNewChat = async () => {
    const newId = await addConversation("New Chat");
    setCurrentConversationId(newId);
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
    setEditingConversationId(id);
    setEditingName(currentTitle);
  };

  const handleSaveEdit = (id: string) => {
    if (editingName.trim()) {
      renameConversation(id, editingName.trim());
    }
    setEditingConversationId(null);
  };

  const handleCancelEdit = () => {
    setEditingConversationId(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      handleSaveEdit(id);
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleConversationClick = (id: string) => {
    setCurrentConversationId(id);
    if (isMobile) {
      toggleSidebar();
    }
    navigate(`/chat/${id}`);
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 flex flex-col h-full bg-background text-foreground transition-transform duration-300 ease-in-out z-20 border-r border-border ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${isMobile ? "w-full" : "w-[260px]"}`}
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
            {hasConversations ? (
              Object.entries(groupedConversations).map(
                ([group, groupConversations]) =>
                  groupConversations.length > 0 && (
                    <div key={group} className="space-y-1">
                      <h3 className="px-3 text-xs font-medium text-muted-foreground mb-2">
                        {group}
                      </h3>
                      <div className="space-y-1">
                        {groupConversations.map((conversation) => (
                          <div
                            key={conversation.id}
                            className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors duration-200 hover:bg-accent ${
                              currentConversationId === conversation.id
                                ? "bg-accent"
                                : ""
                            }`}
                            onMouseEnter={() => setHoveredChat(conversation.id)}
                            onMouseLeave={() =>
                              setHoveredChat(
                                conversation.id === editingConversationId
                                  ? conversation.id
                                  : null
                              )
                            }
                          >
                            {editingConversationId === conversation.id ? (
                              <div className="flex items-center gap-1 flex-1">
                                <Input
                                  value={editingName}
                                  onChange={(e) =>
                                    setEditingName(e.target.value)
                                  }
                                  onKeyDown={(e) =>
                                    handleEditKeyDown(e, conversation.id)
                                  }
                                  className="h-7 py-1 flex-1"
                                  autoFocus
                                />
                                <button
                                  onClick={() =>
                                    handleSaveEdit(conversation.id)
                                  }
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
                                  to={`/chat/${conversation.id}`}
                                  className="flex-1 truncate"
                                  onClick={() =>
                                    handleConversationClick(conversation.id)
                                  }
                                >
                                  <span className="truncate">
                                    {conversation.title}
                                  </span>
                                </Link>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button
                                      className={`p-1 hover:bg-accent rounded ${
                                        hoveredChat === conversation.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      } transition-opacity duration-200`}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal size={16} />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem
                                      onClick={(e) =>
                                        handleStartEditing(
                                          conversation.id,
                                          conversation.title,
                                          e
                                        )
                                      }
                                    >
                                      <Pencil size={16} className="mr-2" />
                                      Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        deleteConversation(conversation.id)
                                      }
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
                  )
              )
            ) : (
              <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                No conversations yet. Start a new chat!
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-shrink-0 p-3 border-t border-border">
        <button
          onClick={() => setIsPricingOpen(true)}
          className={`w-full flex items-center justify-center gap-2 rounded-md ${
            theme === "dark"
              ? "bg-white hover:bg-white/90 text-gray-900"
              : "bg-gray-900 hover:bg-gray-800 text-white"
          } transition-colors duration-200 py-2 px-3 text-sm`}
        >
          <span>Upgrade Plan</span>
        </button>
      </div>

      <PricingModal open={isPricingOpen} onOpenChange={setIsPricingOpen} />
    </aside>
  );
};

export default Sidebar;
