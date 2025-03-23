import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  dracula,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { useChat } from "../../context/ChatContext";
import { useTheme } from "../../context/ThemeContext";
import ChatInput from "../ui/ChatInput";
import { ScrollArea } from "../ui/scroll-area";

interface ChatContainerProps {
  conversationId: string;
}

type CodeComponentProps = {
  inline: boolean;
  className?: string;
  children: React.ReactNode;
};

const ChatContainer: React.FC<ChatContainerProps> = ({ conversationId }) => {
  const { messages, addMessage, isGeneratingResponse, fetchMessages } =
    useChat();
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const conversationMessages = useMemo(
    () => messages[conversationId] || [],
    [messages, conversationId]
  );
  const isGenerating = isGeneratingResponse[conversationId] || false;

  const handleSendMessage = (content: string) => {
    addMessage(conversationId, content, "user");
  };

  useEffect(() => {
    setLoadingMessages(true);
    fetchMessages(conversationId).then(() => {
      setLoadingMessages(false);
    });
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [conversationMessages]);

  if (loadingMessages) {
    return (
      <div className="flex-1 flex flex-col h-full items-center justify-center">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-8 h-8 border-4 border-t-4 border-gray-300 rounded-full animate-spin border-t-gray-500"></div>
        </div>
        <h1 className="text-2xl font-semibold mt-4">Loading Messages...</h1>
      </div>
    );
  }

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
                        <div
                          className={`space-y-5 ${
                            theme === "dark"
                              ? "text-foreground"
                              : "text-gray-800"
                          }`}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code: ({
                                inline,
                                className,
                                children,
                                ...props
                              }: CodeComponentProps) => {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
                                const value = String(children).trim();

                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    style={
                                      theme === "dark" ? dracula : oneLight
                                    }
                                    language={match[1]}
                                    PreTag="div"
                                    className="font-mono text-sm p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800"
                                    {...props}
                                  >
                                    {value}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code
                                    className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 text-sm font-mono rounded"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                              h1: ({ children }) => (
                                <h1 className="text-3xl font-bold mt-4 mb-2">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-2xl font-semibold mt-3 mb-2">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-xl font-semibold mt-3 mb-2">
                                  {children}
                                </h3>
                              ),
                              p: ({ children }) => (
                                <p className="mb-2 leading-relaxed">
                                  {children}
                                </p>
                              ), // Added better spacing
                              ul: ({ children }) => (
                                <ul className="list-disc list-outside pl-5 mb-2">
                                  {children}
                                </ul>
                              ), // Fix for bullet points
                              ol: ({ children }) => (
                                <ol className="list-decimal list-outside pl-5 mb-2">
                                  {children}
                                </ol>
                              ), // Fix for ordered lists
                              li: ({ children }) => (
                                <li className="mb-1">{children}</li>
                              ), // Proper spacing in lists
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-600 dark:text-gray-300 mb-2">
                                  {children}
                                </blockquote>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-bold">
                                  {children}
                                </strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic">{children}</em>
                              ),
                              table: ({ children }) => (
                                <div className="overflow-auto max-w-full">
                                  <table className="table-auto text-sm border-collapse border border-gray-200 mb-2">
                                    {children}
                                  </table>
                                </div>
                              ),
                              thead: ({ children }) => (
                                <thead className="bg-gray-200 dark:bg-gray-700">
                                  {children}
                                </thead>
                              ),
                              tbody: ({ children }) => (
                                <tbody className="divide-y">{children}</tbody>
                              ),
                              tr: ({ children }) => (
                                <tr className="border-b *:border border-gray-200">
                                  {children}
                                </tr>
                              ),
                              th: ({ children }) => (
                                <th className="sm:px-4 px-3 py-2 text-left bg-gray-100 dark:bg-gray-700">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="sm:px-4 px-3 py-2">
                                  {children}
                                </td>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
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
