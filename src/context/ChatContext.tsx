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
    // Today
    {
      id: "today-tech-performance",
      title: "Tech Stocks Performance Today",
      date: new Date(),
    },
    {
      id: "today-bitcoin-price",
      title: "Bitcoin Price Movement Today",
      date: new Date(),
    },

    // Yesterday
    {
      id: "yesterday-eur-usd",
      title: "EUR/USD Yesterday's Performance",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "yesterday-sp500-close",
      title: "S&P 500 Close Yesterday",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "yesterday-eth-staking",
      title: "Ethereum Staking Rewards Update",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "yesterday-gbp-jpy",
      title: "GBP/JPY Sentiment Analysis",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "yesterday-nyse-finance",
      title: "NYSE Financial Sector Review",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },

    // Last 7 Days
    {
      id: "week-altcoin-trends",
      title: "Altcoin Market Trends Overview",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "week-aud-usd-calendar",
      title: "AUD/USD Weekly Economic Calendar",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "week-tech-earnings",
      title: "Tech Earnings for the Week",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      id: "week-defi-tvl",
      title: "Defi TVL Growth Report",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "week-cad-jpy",
      title: "CAD/JPY Market Movements",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      id: "week-tech-rally",
      title: "Tech Stock Rally Analysis",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },

    // Last 30 Days
    {
      id: "month-chf-jpy-policy",
      title: "CHF/JPY Policy Impact Review",
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-nasdaq-tech",
      title: "NASDAQ Tech Sector Trends",
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-btc-usd-trends",
      title: "BTC/USD 30 Day Trend",
      date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-eur-usd-evaluation",
      title: "EUR/USD 30 Day Evaluation",
      date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-nyse-ba-volume",
      title: "NYSE BA Volume Analysis",
      date: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-eth-2-performance",
      title: "ETH 2.0 30 Day Performance",
      date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-gbp-jpy-impact",
      title: "GBP/JPY 30 Day Impact",
      date: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-sp500-sector",
      title: "S&P 500 Sector Review",
      date: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-altcoin-market",
      title: "Altcoin 30 Day Overview",
      date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-aud-usd-review",
      title: "AUD/USD 30 Day Review",
      date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-eth-usd-fluctuations",
      title: "ETH/USD 30 Day Fluctuations",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-gbp-usd-analysis",
      title: "GBP/USD 35 Day Analysis",
      date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-tech-performance",
      title: "Tech Stock 40 Day Trends",
      date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-eth-usd-price",
      title: "ETH/USD 45 Day Price",
      date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-usd-jpy-assessment",
      title: "USD/JPY 47 Day Assessment",
      date: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-tech-stock-performance",
      title: "Tech Stocks 42 Day Review",
      date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-ltc-market-overview",
      title: "Litecoin 43 Day Overview",
      date: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-usd-chf-sentiment",
      title: "USD/CHF 49 Day Sentiment",
      date: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-eur-usd-evaluation",
      title: "EUR/USD 30 Day Evaluation",
      date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-nyse-ba-volume",
      title: "NYSE BA Volume Analysis",
      date: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-eth-2-performance",
      title: "ETH 2.0 30 Day Performance",
      date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-gbp-jpy-impact",
      title: "GBP/JPY 30 Day Impact",
      date: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-sp500-sector",
      title: "S&P 500 Sector Review",
      date: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-altcoin-market",
      title: "Altcoin 30 Day Overview",
      date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-aud-usd-review",
      title: "AUD/USD 30 Day Review",
      date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-eth-usd-fluctuations",
      title: "ETH/USD 30 Day Fluctuations",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-gbp-usd-analysis",
      title: "GBP/USD 35 Day Analysis",
      date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-tech-performance",
      title: "Tech Stock 40 Day Trends",
      date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-eth-usd-price",
      title: "ETH/USD 45 Day Price",
      date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-usd-jpy-assessment",
      title: "USD/JPY 47 Day Assessment",
      date: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-tech-stock-performance",
      title: "Tech Stocks 42 Day Review",
      date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-ltc-market-overview",
      title: "Litecoin 43 Day Overview",
      date: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000),
    },
    {
      id: "month-usd-chf-sentiment",
      title: "USD/CHF 49 Day Sentiment",
      date: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000),
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
