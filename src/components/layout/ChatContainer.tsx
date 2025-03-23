import React, { useEffect, useMemo, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import { useTheme } from "../../context/ThemeContext";
import ChatInput from "../ui/ChatInput";
import { ScrollArea } from "../ui/scroll-area";

interface ChatContainerProps {
  conversationId: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ conversationId }) => {
  const { messages, addMessage, isGeneratingResponse } = useChat();
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationMessages = useMemo(
    () => messages[conversationId] || [],
    [messages, conversationId]
  );
  const isGenerating = isGeneratingResponse[conversationId] || false;

  const handleSendMessage = (content: string) => {
    addMessage(conversationId, content, "user");
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  return (
    <div className="flex flex-col h-full w-full bg-chat-background">
      {conversationMessages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-semibold mb-6">What can I help with?</h1>
          <div className="w-full max-w-3xl">
            <ChatInput
              onSubmit={handleSendMessage}
              placeholder="Ask anything"
              conversationId={conversationId}
            />
          </div>
        </div>
      ) : (
        <>
          <ScrollArea
            className="flex-1 overflow-y-auto overflow-x-hidden"
            style={{ paddingRight: "8px" }}
          >
            <div className="p-4 max-w-3xl mx-auto">
              {conversationMessages.map((message, index) => (
                <div
                  key={message.id}
                  className={`${
                    message.sender === "ai" &&
                    index === conversationMessages.length - 1 &&
                    isGenerating
                      ? "animate-fade-in"
                      : ""
                  } ${message.sender === "user" ? "mb-6" : "mb-8"}`}
                >
                  {message.sender === "user" ? (
                    <div className="flex justify-end">
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                          theme === "dark"
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col w-full">
                      <div className="max-w-full">
                        <p
                          className={`whitespace-pre-wrap ${
                            theme === "dark"
                              ? "text-foreground"
                              : "text-gray-800"
                          }`}
                        >
                          {message.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </ScrollArea>
          <div className="px-4 py-2 flex-shrink-0">
            <ChatInput
              onSubmit={handleSendMessage}
              conversationId={conversationId}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatContainer;
