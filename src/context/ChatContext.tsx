import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Chat = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
};

type Message = {
  id: string;
  chat_id: string;
  sender: "user" | "assistant" | "ai";
  content: string;
  created_at: string;
};

interface ChatContextType {
  chats: Chat[];
  currentChatId: string | null;
  messages: Record<string, Message[]>;
  addChat: (title: string) => Promise<string>;
  addMessage: (
    chatId: string,
    content: string,
    sender: "user" | "ai"
  ) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  renameChat: (id: string, newTitle: string) => Promise<void>;
  setCurrentChatId: (id: string | null) => void;
  fetchMessages: (chatId: string) => Promise<void>;
  isGeneratingResponse: Record<string, boolean>;
  stopResponseGeneration: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isGeneratingResponse, setIsGeneratingResponse] = useState<
    Record<string, boolean>
  >({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) {
        console.log("User not logged in, chats not fetched.");
        return;
      }

      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setChats(data);
      } else {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [user]);

  const addChat = async (title: string): Promise<string> => {
    if (!user) throw new Error("User not authenticated.");

    const { data, error } = await supabase
      .from("chats")
      .insert([
        {
          title,
          created_at: new Date().toISOString(),
          user_id: user.id,
        },
      ])
      .select("id");

    if (error) throw error;
    const newChat = {
      id: data[0].id,
      title,
      created_at: new Date().toISOString(),
      user_id: user.id,
    };
    setChats((prev) => [newChat, ...prev]);
    return newChat.id;
  };

  const addMessage = async (
    chatId: string,
    content: string,
    sender: "user" | "assistant" | "ai"
  ) => {
    setIsGeneratingResponse((prev) => ({
      ...prev,
      [chatId]: sender === "user",
    }));

    const newMessage = {
      id: `msg-${Date.now()}`,
      chat_id: chatId,
      content,
      sender,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("messages").insert([newMessage]);
    if (error) {
      setIsGeneratingResponse((prev) => ({
        ...prev,
        [chatId]: false,
      }));
      throw error;
    }

    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage],
    }));

    setIsGeneratingResponse((prev) => ({
      ...prev,
      [chatId]: false,
    }));
    console.log("New message added:", newMessage);
  };

  const deleteChat = async (id: string) => {
    await supabase.from("messages").delete().eq("chat_id", id);
    await supabase.from("chats").delete().eq("id", id);
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    if (currentChatId === id) {
      setCurrentChatId(null);
    }
    console.log("Chat deleted, id:", id);
  };

  const renameChat = async (id: string, newTitle: string) => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .update({ title: newTitle })
        .eq("id", id)
        .select();

      if (error) {
        console.error("Error renaming chat:", error);
        return;
      }

      if (data && data.length > 0) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === id ? { ...chat, title: newTitle } : chat
          )
        );
      }
    } catch (error) {
      console.error("Unexpected error renaming chat:", error);
    }
  };

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages((prevMessages) => ({
        ...prevMessages,
        [conversationId]: data,
      }));
    } catch (err) {
      console.error("Error in fetching messages:", err);
    }
  }, []);

  const stopResponseGeneration = (chatId: string) => {
    setIsGeneratingResponse((prev) => ({
      ...prev,
      [chatId]: false,
    }));
    console.log("Response generation stopped for chat:", chatId);
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        messages,
        addChat,
        addMessage,
        deleteChat,
        renameChat,
        setCurrentChatId,
        fetchMessages,
        isGeneratingResponse,
        stopResponseGeneration,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
