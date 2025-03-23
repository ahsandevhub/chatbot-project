import React, { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ChatContainer from "../components/layout/ChatContainer";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { useChat } from "../context/ChatContext";
import { useIsMobile } from "../hooks/use-mobile";

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { chats, setCurrentChatId, fetchMessages, loading } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  const hasRedirected = useRef(false); // Track redirection state

  useEffect(() => {
    if (loading) return; // Prevent execution during loading
    if (!chats.length) {
      // If there are no chats, ensure redirection
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        navigate("/chat");
      }
      return;
    }

    if (id) {
      const chatExists = chats.some((c) => c.id === id);
      if (!chatExists && !hasRedirected.current) {
        console.warn(`Chat with ID ${id} not found. Redirecting...`);
        hasRedirected.current = true; // Prevent multiple redirects
        setCurrentChatId(null); // Clear the current chat ID
        navigate("/chat");
        return;
      }

      setCurrentChatId(id);
      fetchMessages(id);
    }

    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [id, chats, navigate, setCurrentChatId, fetchMessages, isMobile, loading]);

  if (!id) {
    return <Navigate to="/chat" />;
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
