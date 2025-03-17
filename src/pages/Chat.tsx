
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ChatContainer from "../components/layout/ChatContainer";
import { useChat } from "../context/ChatContext";
import { useIsMobile } from "../hooks/use-mobile";

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { conversations, setCurrentConversationId } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (id) {
      const conversationExists = conversations.some(c => c.id === id);
      if (!conversationExists) {
        navigate("/");
        return;
      }
      
      setCurrentConversationId(id);
    }
    
    // Auto-close sidebar on mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [id, conversations, navigate, setCurrentConversationId, isMobile]);
  
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
          marginLeft: !isMobile && isSidebarOpen ? '260px' : '0'
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
