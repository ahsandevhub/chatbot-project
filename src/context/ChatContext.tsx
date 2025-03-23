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
import { useNavigate } from "react-router-dom";

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
  loading: boolean; // Add loading state
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
  const [stopGeneration, setStopGeneration] = useState<Record<string, boolean>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const stopGenerationRef = useRef<Record<string, boolean>>({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) {
        console.log("User not logged in, chats not fetched.");
        setLoading(false); // Set loading to false when user is not present.
        return;
      }

      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setChats(data);
        setLoading(false); // Set loading to false when chats are loaded.
      } else {
        console.error("Error fetching chats:", error);
        setLoading(false); // Also set loading to false on error.
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
    sender: "user" | "ai"
  ) => {
    setIsGeneratingResponse((prev) => ({
      ...prev,
      [chatId]: sender === "user",
    }));
    setStopGeneration((prev) => ({ ...prev, [chatId]: false }));

    const newMessage: Message = {
      id: crypto.randomUUID(),
      chat_id: chatId,
      content,
      sender,
      created_at: new Date().toISOString(),
    };

    // Insert the new message into the database *first*
    try {
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert([newMessage])
        .select();
      if (messageError) {
        console.error("Error inserting message:", messageError);
        throw messageError; // Crucial: Propagate the error!
      }
      // Use the ID from the database result.
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
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: [...messagesForNebius, { role: "user", content }]
                  .map((m) => m.content)
                  .join("\n"),
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
          if (!reader) {
            throw new Error("No reader available");
          }

          const decoder = new TextDecoder();
          let fullAiResponse = "";
          let done = false;
          let aiMessageId: string | null = null;

          while (!done) {
            if (stopGenerationRef.current[chatId]) {
              console.log(`Stopping response for chatId: ${chatId}`);
              break; // Exit the loop immediately
            }

            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
              const textChunk = decoder.decode(value, { stream: true });
              fullAiResponse += textChunk;

              if (aiMessageId) {
                setMessages((prevMessages) => {
                  const chatMessages = prevMessages[chatId] || [];
                  const updatedMessages = chatMessages.map((m) =>
                    m.id === aiMessageId ? { ...m, content: fullAiResponse } : m
                  );
                  return {
                    ...prevMessages,
                    [chatId]: updatedMessages,
                  };
                });
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

          if (aiMessageError) {
            console.error("Error inserting AI message:", aiMessageError);
            return;
          }

          setMessages((prevMessages) => {
            const chatMessages = prevMessages[chatId] || [];
            const updatedMessages = chatMessages.map((m) =>
              m.id === "temp_id" ? { ...aiMessage, id: aiMessageData[0].id } : m
            );
            return {
              ...prevMessages,
              [chatId]: updatedMessages,
            };
          });

          console.log("Messages for chatId", chatId, ":", messages[chatId]);
          console.log("Messages length", messages[chatId]?.length);

          if (messages[chatId]?.length === 0) {
            const generatedTitle = await generateChatTitle(
              chatId,
              fullAiResponse
            );
            if (generatedTitle) {
              console.log("Renaming chat with title:", generatedTitle);
              renameChat(chatId, generatedTitle);
            }
          }

          setIsGeneratingResponse((prev) => ({ ...prev, [chatId]: false }));
          setStopGeneration((prev) => ({ ...prev, [chatId]: true }));
        } catch (apiError) {
          console.error("Error calling Nebius API:", apiError);
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

            setMessages((prevMessages) => {
              const chatMessages = prevMessages[chatId] || [];
              return {
                ...prevMessages,
                [chatId]: chatMessages.map((m) =>
                  m.id === "temp_error" ? { ...m, content: displayedText } : m
                ),
              };
            });
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
            setMessages((prevMessages) => {
              const chatMessages = prevMessages[chatId] || [];
              return {
                ...prevMessages,
                [chatId]: chatMessages.map((m) =>
                  m.id === "temp_error"
                    ? { ...aiErrorMessage, id: aiMessageData[0].id }
                    : m
                ),
              };
            });
          } else {
            console.error("Error saving AI error message:", aiMessageError);
          }
        }
      }
    } catch (error) {
      // Handle the error from the initial message insert
      console.error("Error inserting user message:", error);
      //  Consider adding a user-friendly error message to the UI here.
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        chat_id: chatId,
        content: "Failed to send message.", // Or a more helpful message
        sender: sender, // Keep original sender
        created_at: new Date().toISOString(),
      };
      setMessages((prevMessages) => ({
        ...prevMessages,
        [chatId]: [...(prevMessages[chatId] || []), errorMessage],
      }));
    }
  };

  const updateMessageContent = async (
    chatId: string,
    messageId: string,
    newContent: string
  ) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ content: newContent })
        .eq("id", messageId);

      if (error) {
        console.error("Error updating message content:", error);
        return; // Important:  Exit if update fails
      }

      // Update the local state
      setMessages((prevMessages) => {
        const chatMessages = prevMessages[chatId] || [];
        const updatedMessages = chatMessages.map((msg) =>
          msg.id === messageId ? { ...msg, content: newContent } : msg
        );
        return {
          ...prevMessages,
          [chatId]: updatedMessages,
        };
      });
    } catch (error) {
      console.error("Error updating message content in local state", error);
    }
  };

  const stopResponseGeneration = (chatId: string) => {
    console.log(`Stopping response for chatId: ${chatId}`);
    stopGenerationRef.current[chatId] = true; // Use ref instead of state
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

    console.log("Chat deleted, id:", id);
  };

  const generateChatTitle = async (chatId: string, firstAiResponse: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/generate-title`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: firstAiResponse }),
        }
      );

      console.log("Title generation response status:", response.status);

      if (!response.ok) {
        console.error("Error generating title:", response.status);
        return "Untitled Chat";
      }

      const { title } = await response.json();
      console.log("Generated title:", title);
      return title;
    } catch (error) {
      console.error("Error generating chat title:", error);
      return "Untitled Chat";
    }
  };

  const renameChat = async (id: string, newTitle: string) => {
    try {
      console.log("Renaming chat ID:", id, "with title:", newTitle);
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

  const savePartialResponse = async (
    chatId: string,
    content: string,
    stopped = false
  ) => {
    if (stopped) {
      setIsGeneratingResponse((prev) => ({ ...prev, [chatId]: false }));
      return;
    }
    if (!content.trim()) return;

    // Check if a temporary AI message exists
    const existingMessageIndex = messages[chatId]?.findIndex(
      (msg) => msg.sender === "ai" && !msg.id
    );

    if (existingMessageIndex > -1) {
      // Update the existing temporary message
      const updatedMessage = {
        ...messages[chatId][existingMessageIndex],
        content: content,
      };

      // Update in supabase
      const { data: updatedData, error: updatedError } = await supabase
        .from("messages")
        .update({ content: content })
        .eq("id", messages[chatId][existingMessageIndex].id) // Use the id of the temp message
        .select();

      if (updatedError) {
        console.error("Error updating partial response:", updatedError);
        return;
      }
      // Update in local state
      setMessages((prevMessages) => ({
        ...prevMessages,
        [chatId]: messages[chatId].map((msg, index) =>
          index === existingMessageIndex ? updatedData[0] : msg
        ),
      }));
    } else {
      // Insert a new temporary message
      const aiMessage = {
        chat_id: chatId,
        content,
        sender: "ai",
        created_at: new Date().toISOString(),
      };

      const { data: insertedData, error: insertedError } = await supabase
        .from("messages")
        .insert([aiMessage])
        .select();

      if (insertedError) {
        console.error("Error inserting partial response:", insertedError);
        return;
      }

      // Update in local state
      setMessages((prevMessages) => ({
        ...prevMessages,
        [chatId]: [...(prevMessages[chatId] || []), insertedData[0]],
      }));
    }
    setIsGeneratingResponse((prev) => ({ ...prev, [chatId]: false }));
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
