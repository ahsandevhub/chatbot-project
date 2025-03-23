// src/components/ui/ChatInput.tsx
import { SendIcon, Square } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  conversationId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  placeholder = "Ask anything",
  conversationId,
}) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { isGeneratingResponse, stopResponseGeneration } = useChat();

  const isGenerating = isGeneratingResponse[conversationId] || false;

  // Track if user is currently editing elsewhere on the page
  const [isEditingElsewhere, setIsEditingElsewhere] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isGenerating) {
      onSubmit(message);
      setMessage("");

      // Focus the input immediately after sending message
      if (inputRef.current) {
        inputRef.current.focus();
      }

      // Ensure focus is maintained with multiple approaches for reliability
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);

      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isGenerating) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleStopGeneration = () => {
    stopResponseGeneration(conversationId);
  };

  // Auto-adjust height of textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Focus the input when the component mounts or updates, but be smarter about it
  useEffect(() => {
    // Check if any input or textarea on the page has focus and is not our chat input
    const checkForActiveEditing = () => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA") &&
        activeElement !== inputRef.current
      ) {
        setIsEditingElsewhere(true);
      } else {
        setIsEditingElsewhere(false);
      }
    };

    // Regular document event listeners for focus detection
    document.addEventListener("focusin", checkForActiveEditing);

    const focusInput = () => {
      if (!isGenerating && document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    };

    // Initial focus attempt
    if (!isEditingElsewhere) {
      focusInput();
    }

    // Focus when route changes, with delay
    const timeoutId = setTimeout(() => {
      if (!isEditingElsewhere) {
        focusInput();
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("focusin", checkForActiveEditing);
    };
  }, [isGenerating, conversationId, isEditingElsewhere]);

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex items-center relative border ${
            isGenerating ? "bg-gray-50" : "bg-chat-input-background"
          } border-chat-input-border rounded-xl shadow-sm`}
        >
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isGenerating ? "Waiting for response..." : placeholder}
            rows={1}
            disabled={isGenerating}
            className={`flex-1 py-3 px-4 bg-transparent focus:outline-none resize-none max-h-[200px] overflow-y-auto ${
              isGenerating ? "text-gray-400 cursor-not-allowed" : ""
            }`}
          />

          {isGenerating ? (
            <button
              type="button"
              onClick={handleStopGeneration}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
              title="Stop generating"
            >
              <Square size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!message.trim() || isGenerating}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                message.trim() && !isGenerating
                  ? "opacity-100"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <SendIcon
                size={16}
                className={isGenerating ? "text-gray-400" : "text-gray-700"}
              />
            </button>
          )}
        </div>

        <div className="mt-2 text-center text-xs text-gray-500">
          {isGenerating ? (
            <span className="text-blue-500">
              AI is generating a response...
            </span>
          ) : (
            "Disclaimer: Mistakes can happen and all provided information is for educational purposes only."
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
