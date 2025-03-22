import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ChatContainer from "../components/layout/ChatContainer";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { useChat } from "../context/ChatContext";
import { useIsMobile } from "../hooks/use-mobile";

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { chats, setCurrentChatId, fetchMessages } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const [hasFetchedMessages, setHasFetchedMessages] = useState(false); // Track message fetching

  useEffect(() => {
    if (id) {
      const chatExists = chats.some((c) => c.id === id);
      if (!chatExists) {
        navigate("/");
        return;
      }

      setCurrentChatId(id);

      // Fetch messages only if they haven't been fetched yet for this id
      if (!hasFetchedMessages) {
        fetchMessages(id);
        setHasFetchedMessages(true);
      }
    }

    // Auto-close sidebar on mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [
    id,
    navigate,
    setCurrentChatId,
    fetchMessages,
    isMobile,
    hasFetchedMessages,
  ]);

  if (!id) {
    return <Navigate to="/" />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex flex-col flex-1 transition-all duration-300 w-full`}
        style={{
          marginLeft: !isMobile && isSidebarOpen ? "260px" : "0",
        }}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 overflow-hidden">
          <ChatContainer conversationId={id} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
