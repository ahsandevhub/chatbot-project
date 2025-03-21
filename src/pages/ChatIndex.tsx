// src/pages/ChatIndex.tsx
import { supabase } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import ChatInput from "../components/ui/ChatInput";
import { useChat } from "../context/ChatContext";
import { useIsMobile } from "../hooks/use-mobile";

const ChatIndex: React.FC = () => {
  const { addConversation, addMessage } = useChat();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const temporaryConversationId = "temp-home-page";

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
      const newId = await addConversation(title);

      addMessage(newId, content, "user");

      await supabase
        .from("conversations")
        .insert([{ id: newId, title, date: new Date().toISOString() }]);

      await supabase.from("messages").insert([
        {
          id: `msg-${Date.now()}`,
          conversationId: newId,
          content,
          sender: "user",
          timestamp: new Date().toISOString(),
        },
      ]);

      // Simulate a dummy response from the AI
      const dummyResponse = `Dummy response: ${content}`;
      setTimeout(async () => {
        addMessage(newId, dummyResponse, "ai");
        await supabase.from("messages").insert([
          {
            id: `msg-${Date.now() + 1}`,
            conversationId: newId,
            content: dummyResponse,
            sender: "ai",
            timestamp: new Date().toISOString(),
          },
        ]);
        navigate(`/chat/${newId}`);
      }, 1000); // Simulate a 1-second delay for the AI response
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, show an error message to the user
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
