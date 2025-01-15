"use client";

import { useState } from "react";
import { Message } from "@/interfaces/Message";
import ChatContainer from "@/components/chat/ChatContainer";
import { AIResponse, clearMemory } from "@/api/chatApi";

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    try {
      await clearMemory();
      setMessages((prev) => [
        ...prev,
        { text: "Chat has been cleared", sender: "assistant" },
      ]);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return (
    <ChatContainer
      title="AI Chat"
      description="Chat with our AI assistant"
      messages={messages}
      isLoading={isLoading}
      onSend={handleSend}
      onClear={handleClear}
    />
  );
};

export default AIChat;
