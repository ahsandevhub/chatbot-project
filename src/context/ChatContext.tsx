// src/context/ChatContext.tsx
import { supabase } from "@/lib/supabaseClient";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Conversation = {
  id: string;
  userId: string;
  title: string;
  date: string;
};

type Message = {
  id: string;
  conversationId: string;
  content: string;
  sender: "user" | "assistant" | "ai"; // Added "ai" here
  timestamp: string;
};

interface ChatContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  messages: Record<string, Message[]>;
  addConversation: (title: string) => Promise<string>;
  addMessage: (
    conversationId: string,
    content: string,
    sender: "user" | "assistant" | "ai" // Added "ai" here
  ) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  renameConversation: (id: string, newTitle: string) => Promise<void>;
  setCurrentConversationId: (id: string | null) => void;
  fetchMessages: (conversationId: string) => Promise<void>;
  isGeneratingResponse: Record<string, boolean>;
  stopResponseGeneration: (conversationId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isGeneratingResponse, setIsGeneratingResponse] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase.from("conversations").select("*");
      if (!error && data) setConversations(data);
    };

    fetchConversations();
  }, []);

  const addConversation = async (title: string): Promise<string> => {
    const { data, error } = await supabase
      .from("conversations")
      .insert([
        { title, date: new Date().toISOString(), userId: "your-user-id" },
      ])
      .select("id");

    if (error) throw error;
    const newConversation = {
      id: data[0].id,
      title,
      date: new Date().toISOString(),
      userId: "your-user-id",
    };
    setConversations((prev) => [newConversation, ...prev]);
    return newConversation.id;
  };

  const addMessage = async (
    conversationId: string,
    content: string,
    sender: "user" | "assistant" | "ai" // Added "ai" here
  ) => {
    setIsGeneratingResponse((prev) => ({
      ...prev,
      [conversationId]: sender === "user",
    }));

    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      content,
      sender,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase.from("messages").insert([newMessage]);
    if (error) {
      setIsGeneratingResponse((prev) => ({
        ...prev,
        [conversationId]: false,
      }));
      throw error;
    }

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    setIsGeneratingResponse((prev) => ({
      ...prev,
      [conversationId]: false,
    }));
  };

  const deleteConversation = async (id: string) => {
    await supabase.from("messages").delete().eq("conversationId", id);
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  };

  const renameConversation = async (id: string, newTitle: string) => {
    await supabase
      .from("conversations")
      .update({ title: newTitle })
      .eq("id", id);
    setConversations((prev) =>
      prev.map((conv) => (conv.id === id ? { ...conv, title: newTitle } : conv))
    );
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversationId", conversationId)
      .order("timestamp", { ascending: true });

    if (!error && data) {
      setMessages((prev) => ({ ...prev, [conversationId]: data }));
    } else if (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const stopResponseGeneration = (conversationId: string) => {
    setIsGeneratingResponse((prev) => ({
      ...prev,
      [conversationId]: false,
    }));
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversationId,
        messages,
        addConversation,
        addMessage,
        deleteConversation,
        renameConversation,
        setCurrentConversationId,
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
