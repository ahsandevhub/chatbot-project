import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import ChatInput from "../components/ui/ChatInput";
import { useChat } from "../context/ChatContext";
import { useIsMobile } from "../hooks/use-mobile";

const Index: React.FC = () => {
  const { conversations, addConversation, addMessage } = useChat();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const temporaryConversationId = "temp-home-page"; // Temporary ID for the home page

  useEffect(() => {
    // Auto-close sidebar on mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const handleSendMessage = (content: string) => {
    // Create a new conversation with the first few words as the title
    const title = content.split(" ").slice(0, 4).join(" ") + "...";
    const newId = addConversation(title);

    // Add the message to this conversation
    addMessage(newId, content, "user");

    // Navigate to the new conversation
    navigate(`/chat/${newId}`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="flex flex-col flex-1 w-full transition-all duration-300"
        style={{
          marginLeft: !isMobile && isSidebarOpen ? "260px" : "0",
        }}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl font-semibold mb-6 text-center">
            Which market prices can I pull up for you?
          </h1>
          <div className="w-full max-w-3xl">
            <ChatInput
              onSubmit={handleSendMessage}
              placeholder="Ask anything"
              conversationId={temporaryConversationId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
