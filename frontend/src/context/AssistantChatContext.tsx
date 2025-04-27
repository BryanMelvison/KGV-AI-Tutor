"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { fetchChatHistory } from "@/api/chat";

interface ChatMessage {
  role: "human" | "ai";
  content: string;
  timestamp?: string;
}

interface AssistantChatContextProps {
  chats: ChatMessage[];
  addChat: (chat: ChatMessage) => void;
  loadHistory: (sessionId: string) => Promise<void>;
}

const AssistantChatContext = createContext<AssistantChatContextProps | null>(
  null
);

export const useAssistantChat = () => {
  const ctx = useContext(AssistantChatContext);
  if (!ctx)
    throw new Error(
      "useAssistantChat must be used inside AssistantChatProvider"
    );
  return ctx;
};

export const AssistantChatProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [chats, setChats] = useState<ChatMessage[]>([]);

  const addChat = (chat: ChatMessage) => {
    setChats((prev) => [...prev, chat]);
  };

  const loadHistory = async (sessionId: string) => {
    try {
      const messages = await fetchChatHistory(sessionId);
      setChats(messages); // overwrite with full history
    } catch (error) {
      console.error("Failed to load chat history", error);
    }
  };

  return (
    <AssistantChatContext.Provider value={{ chats, addChat, loadHistory }}>
      {children}
    </AssistantChatContext.Provider>
  );
};
