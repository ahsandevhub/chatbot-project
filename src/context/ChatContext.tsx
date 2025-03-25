/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
  sender: "user" | "ai";
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
  loading: boolean;
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
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const stopGenerationRef = useRef<Record<string, boolean>>({});
  const [credits, setCredits] = useState<number | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setChats(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    const fetchSubscription = async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setSubscription(data);
    };

    const fetchCredits = async () => {
      const { data, error } = await supabase
        .from("user_credits")
        .select("credits_available")
        .eq("user_id", user.id)
        .single();

      setCredits(data?.credits_available);
    };

    fetchChats();
    fetchSubscription();
    fetchCredits();
  }, [user]);

  const addChat = async (title: string): Promise<string> => {
    if (!user) throw new Error("User not authenticated.");

    const { data, error } = await supabase
      .from("chats")
      .insert([
        { title, created_at: new Date().toISOString(), user_id: user.id },
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
    sender: "user" | "ai"
  ) => {
    setIsGeneratingResponse((prev) => ({
      ...prev,
      [chatId]: sender === "user",
    }));
    stopGenerationRef.current[chatId] = false;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      chat_id: chatId,
      content,
      sender,
      created_at: new Date().toISOString(),
    };

    try {
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert([newMessage])
        .select();
      if (messageError) throw messageError;
      const savedMessage: Message = { ...newMessage, id: messageData[0].id };

      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), savedMessage],
      }));

      if (sender === "user") {
        try {
          const messagesForNebius = messages[chatId]
            ? messages[chatId].map((msg) => ({
                role: msg.sender,
                content: msg.content,
              }))
            : [];

          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URI}/api/chat`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: [...messagesForNebius, { role: "user", content }]
                  .map((m) => m.content)
                  .join("\n"),
                userId: user.id,
                tier: subscription?.plan || "intern",
                remainingCredits: credits?.toString() || "0",
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              `HTTP error! status: ${response.status}, message: ${
                errorData?.message || "Unknown error"
              }`
            );
          }
          const reader = response.body?.getReader();
          if (!reader) throw new Error("No reader available");

          const decoder = new TextDecoder();
          let fullAiResponse = "";
          let done = false;
          let aiMessageId: string | null = null;

          while (!done) {
            if (stopGenerationRef.current[chatId]) break;

            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
              const textChunk = decoder.decode(value, { stream: true });
              fullAiResponse += textChunk;

              if (aiMessageId) {
                setMessages((prevMessages) => ({
                  ...prevMessages,
                  [chatId]: (prevMessages[chatId] || []).map((m) =>
                    m.id === aiMessageId ? { ...m, content: fullAiResponse } : m
                  ),
                }));
              } else {
                const newAiMessage: Message = {
                  id: "temp_id",
                  chat_id: chatId,
                  content: fullAiResponse,
                  sender: "ai",
                  created_at: new Date().toISOString(),
                };
                setMessages((prevMessages) => ({
                  ...prevMessages,
                  [chatId]: [...(prevMessages[chatId] || []), newAiMessage],
                }));
                aiMessageId = "temp_id";
              }
            }
          }

          const aiMessage: Message = {
            id: crypto.randomUUID(),
            chat_id: chatId,
            content: fullAiResponse,
            sender: "ai",
            created_at: new Date().toISOString(),
          };

          const { data: aiMessageData, error: aiMessageError } = await supabase
            .from("messages")
            .insert([aiMessage])
            .select();

          if (aiMessageError) return;

          setMessages((prevMessages) => ({
            ...prevMessages,
            [chatId]: (prevMessages[chatId] || []).map((m) =>
              m.id === "temp_id" ? { ...aiMessage, id: aiMessageData[0].id } : m
            ),
          }));

          if (messages[chatId]?.length === 0) {
            const generatedTitle = await generateChatTitle(
              chatId,
              fullAiResponse
            );
            if (generatedTitle) {
              renameChat(chatId, generatedTitle);
            }
          }

          setIsGeneratingResponse((prev) => ({ ...prev, [chatId]: false }));
        } catch (apiError) {
          setIsGeneratingResponse((prev) => ({ ...prev, [chatId]: false }));

          const errorText = "Sorry, I encountered an error.";
          let displayedText = "";

          const errorMessage: Message = {
            id: "temp_error",
            chat_id: chatId,
            content: displayedText,
            sender: "ai",
            created_at: new Date().toISOString(),
          };

          setMessages((prevMessages) => ({
            ...prevMessages,
            [chatId]: [...(prevMessages[chatId] || []), errorMessage],
          }));

          for (let i = 0; i < errorText.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 50));
            displayedText += errorText[i];

            setMessages((prevMessages) => ({
              ...prevMessages,
              [chatId]: (prevMessages[chatId] || []).map((m) =>
                m.id === "temp_error" ? { ...m, content: displayedText } : m
              ),
            }));
          }

          const aiErrorMessage: Message = {
            id: crypto.randomUUID(),
            chat_id: chatId,
            content: errorText,
            sender: "ai",
            created_at: new Date().toISOString(),
          };

          const { data: aiMessageData, error: aiMessageError } = await supabase
            .from("messages")
            .insert([aiErrorMessage])
            .select();

          if (!aiMessageError && aiMessageData) {
            setMessages((prevMessages) => ({
              ...prevMessages,
              [chatId]: (prevMessages[chatId] || []).map((m) =>
                m.id === "temp_error"
                  ? { ...aiErrorMessage, id: aiMessageData[0].id }
                  : m
              ),
            }));
          }
        }
      }
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        chat_id: chatId,
        content: "Failed to send message.",
        sender: sender,
        created_at: new Date().toISOString(),
      };
      setMessages((prevMessages) => ({
        ...prevMessages,
        [chatId]: [...(prevMessages[chatId] || []), errorMessage],
      }));
    }
  };

  const stopResponseGeneration = (chatId: string) => {
    stopGenerationRef.current[chatId] = true;
    setIsGeneratingResponse((prev) => ({
      ...prev,
      [chatId]: false,
    }));
  };

  const deleteChat = async (id: string) => {
    await supabase.from("messages").delete().eq("chat_id", id);
    await supabase.from("chats").delete().eq("id", id);
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    if (currentChatId === id) {
      setCurrentChatId(null);
    }
  };

  const generateChatTitle = async (chatId: string, firstAiResponse: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/generate-title`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: firstAiResponse }),
        }
      );

      if (!response.ok) {
        return "Untitled Chat";
      }

      const { title } = await response.json();
      return title;
    } catch (error) {
      return "Untitled Chat";
    }
  };

  const renameChat = async (id: string, newTitle: string) => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .update({ title: newTitle })
        .eq("id", id)
        .select();

      if (error) return;

      if (data && data.length > 0) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === id ? { ...chat, title: newTitle } : chat
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) return;

      setMessages((prevMessages) => ({
        ...prevMessages,
        [conversationId]: data,
      }));
    } catch (err) {
      console.error(err);
    }
  }, []);

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
        loading,
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
