"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Message } from "@/interfaces/Message";
import ChatContainer from "@/components/chat/ChatContainer";
import { mockAIResponse } from "@/api/mockChat";
=======
import { useState } from "react";
import { Message } from "@/interfaces/Message";
import ChatContainer from "@/components/chat/ChatContainer";
import { AIResponse, clearMemory } from "@/api/chatApi";
>>>>>>> origin/main

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (message: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);

    try {
<<<<<<< HEAD
      const response = await mockAIResponse(message);
=======
      const response = await AIResponse(message);
>>>>>>> origin/main
      setMessages((prev) => [...prev, { text: response, sender: "assistant" }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
=======
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

>>>>>>> origin/main
  return (
    <ChatContainer
      title="AI Chat"
      description="Chat with our AI assistant"
      messages={messages}
      isLoading={isLoading}
      onSend={handleSend}
<<<<<<< HEAD
=======
      onClear={handleClear}
>>>>>>> origin/main
    />
  );
};

export default AIChat;
