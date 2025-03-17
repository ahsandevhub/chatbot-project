import React, { createContext, ReactNode, useContext, useState } from "react";

type Conversation = {
  id: string;
  title: string;
  date: Date;
};

type Message = {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

interface ChatContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  messages: Record<string, Message[]>;
  isGeneratingResponse: Record<string, boolean>;
  setCurrentConversationId: (id: string | null) => void;
  addConversation: (title: string) => string;
  addMessage: (
    conversationId: string,
    content: string,
    sender: "user" | "assistant"
  ) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, newTitle: string) => void;
  stopResponseGeneration: (conversationId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "today-1", title: "UX/UI Designer", date: new Date() },
    { id: "today-2", title: "Explore GPTs", date: new Date() },
    {
      id: "yesterday-1",
      title: "UI Clone Request",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "yesterday-2",
      title: "Hello World Interaction",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "yesterday-3",
      title: "HTML Code Explanation",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "yesterday-4",
      title: "React vs Next.js Explained",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "yesterday-5",
      title: "Python UI Design Tips",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "yesterday-6",
      title: "LLM Chat Interface Design",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "week-1",
      title: "React reachat setup guide",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "week-2",
      title: "Random Numbers CSV",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "week-3",
      title: "GmbH Anteliverkauf Steuer",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      id: "week-4",
      title: "Binance API Kline Explanation",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      id: "week-5",
      title: "Format open_time column",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "week-6",
      title: "Sort dict by column",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "week-7",
      title: "Random File Selection Python",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      id: "week-8",
      title: "DeepSeek R1 vs Distil",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      id: "week-9",
      title: "UI design for chat",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "week-10",
      title: "Auto-scaling Web App Setup",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  const [isGeneratingResponse, setIsGeneratingResponse] = useState<
    Record<string, boolean>
  >({});
  const [streamingIntervals, setStreamingIntervals] = useState<
    Record<string, number>
  >({});

  const addConversation = (title: string): string => {
    const id = `new-${Date.now()}`;
    const newConversation: Conversation = {
      id,
      title,
      date: new Date(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [id]: [],
    }));

    return id;
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    const newMessages = { ...messages };
    delete newMessages[id];
    setMessages(newMessages);
  };

  const renameConversation = (id: string, newTitle: string) => {
    setConversations((prevConversations) => {
      return prevConversations.map((conversation) =>
        conversation.id === id
          ? { ...conversation, title: newTitle }
          : conversation
      );
    });
  };

  const stopResponseGeneration = (conversationId: string) => {
    if (streamingIntervals[conversationId]) {
      clearInterval(streamingIntervals[conversationId]);

      const newStreamingIntervals = { ...streamingIntervals };
      delete newStreamingIntervals[conversationId];
      setStreamingIntervals(newStreamingIntervals);
    }

    setIsGeneratingResponse((prev) => ({
      ...prev,
      [conversationId]: false,
    }));
  };

  const addMessage = (
    conversationId: string,
    content: string,
    sender: "user" | "assistant"
  ) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      content,
      sender,
      timestamp: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    if (sender === "user" && !isGeneratingResponse[conversationId]) {
      setIsGeneratingResponse((prev) => ({
        ...prev,
        [conversationId]: true,
      }));

      const dummyResponses = [
        "I understand your question. Let me think about it...",
        "Based on the information provided, I can help you with that.",
        "Here's what I found about your query...",
        "That's an interesting question! Here's my response...",
      ];

      const response =
        dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
      let displayedResponse = "";

      const streamResponse = (fullResponse: string) => {
        let i = 0;
        const streamingMessageId = `msg-streaming-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`;

        setMessages((prev) => {
          const conversationMessages = [...(prev[conversationId] || [])];
          const streamingMessage: Message = {
            id: streamingMessageId,
            content: "",
            sender: "assistant",
            timestamp: new Date(),
          };
          conversationMessages.push(streamingMessage);

          return {
            ...prev,
            [conversationId]: conversationMessages,
          };
        });

        const interval = setInterval(() => {
          if (i < fullResponse.length) {
            displayedResponse += fullResponse[i];

            setMessages((prev) => {
              const conversationMessages = [...(prev[conversationId] || [])];

              const streamingIndex = conversationMessages.findIndex(
                (m) => m.id === streamingMessageId
              );

              if (streamingIndex >= 0) {
                conversationMessages[streamingIndex] = {
                  ...conversationMessages[streamingIndex],
                  content: displayedResponse,
                };
              }

              return {
                ...prev,
                [conversationId]: conversationMessages,
              };
            });

            i++;
          } else {
            clearInterval(interval);

            const newStreamingIntervals = { ...streamingIntervals };
            delete newStreamingIntervals[conversationId];
            setStreamingIntervals(newStreamingIntervals);

            setIsGeneratingResponse((prev) => ({
              ...prev,
              [conversationId]: false,
            }));
          }
        }, 50);

        setStreamingIntervals((prev) => ({
          ...prev,
          [conversationId]: interval as unknown as number,
        }));
      };

      setTimeout(() => streamResponse(response), 500);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversationId,
        messages,
        isGeneratingResponse,
        setCurrentConversationId,
        addConversation,
        addMessage,
        deleteConversation,
        renameConversation,
        stopResponseGeneration,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
