import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import ChatInput from "../components/ui/ChatInput";
import { useChat } from "../context/ChatContext";
import { useIsMobile } from "../hooks/use-mobile";

const ChatIndex: React.FC = () => {
  const { addChat, addMessage } = useChat(); // Fixed method names
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const temporaryConversationId = "temp-home-page"; // Temporary ID for now
  const { user } = useAuth();

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const handleSendMessage = async (content: string) => {
    try {
      const title = content.split(" ").slice(0, 4).join(" ") + "...";
      const newId = await addChat(title);

      addMessage(newId, content, "user");

      // Corrected database insertion to use the 'chats' table
      await supabase.from("chats").insert([
        {
          id: newId,
          title,
          created_at: new Date().toISOString(), // Use 'created_at' to match your schema
          user_id: user.id, // added user_id
        },
      ]);

      await supabase.from("messages").insert([
        {
          id: `msg-${Date.now()}`,
          chat_id: newId, // use chat_id instead conversationId
          content,
          sender: "user",
          created_at: new Date().toISOString(), // Use 'created_at' to match your schema
        },
      ]);

      const dummyResponse = `Dummy response: ${content}`;
      setTimeout(async () => {
        addMessage(newId, dummyResponse, "ai");
        await supabase.from("messages").insert([
          {
            id: `msg-${Date.now() + 1}`,
            chat_id: newId, // use chat_id instead conversationId
            content: dummyResponse,
            sender: "ai",
            created_at: new Date().toISOString(), // Use 'created_at' to match your schema
          },
        ]);
        navigate(`/chat/${newId}`);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
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

export default ChatIndex;
