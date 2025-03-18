"use client";

import { useState } from "react";
import { Message } from "@/interfaces/Message";
import ChatContainer from "@/components/chat/ChatContainer";
import { AIResponse, clearMemory } from "@/api/chatApi";

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showClearMessage, setShowClearMessage] = useState(false);

  const handleSend = async (message: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);

    try {
      const response = await AIResponse(message);
      setMessages((prev) => [...prev, { text: response, sender: "assistant" }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    setShowClearMessage(true);
    try {
      await clearMemory();
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
    setTimeout(() => {
      setShowClearMessage(false);
    }, 2000);
  };

  const headerContent = (
    <>
      {showClearMessage && (
        <div
          className="fixed top-0 left-0 right-0 bg-zinc-900 text-white text-center py-2 transition-all duration-300"
          style={{
            zIndex: 1000,
          }}
        >
          Context cleared
        </div>
      )}
      <div>
        <h2 className="text-2xl font-semibold text-[#17171F]">AI Chat</h2>
        <p className="text-gray-500">Chat with our AI assistant</p>
      </div>
    </>
  );

  return (
    <ChatContainer
      messages={messages}
      isLoading={isLoading}
      onSend={handleSend}
      onClear={handleClear}
      headerContent={headerContent}
    />
  );
};

export default AIChat;