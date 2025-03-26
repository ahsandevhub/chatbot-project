import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import ChatInput from "../components/ui/ChatInput";
import { useChat } from "../context/ChatContext";
import { useIsMobile } from "../hooks/use-mobile";

const ChatIndex: React.FC = () => {
  const { addChat, addMessage } = useChat();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleSendMessage = async (content: string) => {
    try {
      setLoadingResponse(true);
      const title = content.split(" ").slice(0, 4).join(" ") + "...";
      const newId = await addChat(title);
      setConversationId(newId); // Set conversation ID

      await addMessage(newId, content, "user");

      navigate(`/chat/${newId}`);

      setLoadingResponse(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setLoadingResponse(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="flex flex-col flex-1 w-full transition-all duration-300"
        style={{ marginLeft: !isMobile && isSidebarOpen ? "260px" : "0" }}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl font-semibold mb-6 text-center">
            Which market prices can I pull up for you?
          </h1>
          <div className="w-full max-w-3xl">
            {/* Pass conversationId to ChatInput */}
            <ChatInput
              onSubmit={handleSendMessage}
              placeholder="Ask anything"
              conversationId={conversationId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatIndex;
