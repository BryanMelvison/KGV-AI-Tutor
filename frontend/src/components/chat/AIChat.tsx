"use client";

import { useState, useEffect } from "react";
import { Message } from "@/interfaces/Message";
import ChatContainer from "@/components/chat/ChatContainer";
import { mockAIResponse } from "@/api/mockChat";

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (message: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);

    try {
      const response = await mockAIResponse(message);
      setMessages((prev) => [...prev, { text: response, sender: "assistant" }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer
      title="AI Chat"
      description="Chat with our AI assistant"
      messages={messages}
      isLoading={isLoading}
      onSend={handleSend}
    />
  );
};

export default AIChat;
