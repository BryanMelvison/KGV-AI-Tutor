"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ChatSummary {
  id: string;
  title: string;
  summary: string;
  time: string;
}

interface AssistantChatContextProps {
  chats: ChatSummary[];
  addChat: (chat: ChatSummary) => void;
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
  const [chats, setChats] = useState<ChatSummary[]>([]);

  const addChat = (chat: ChatSummary) => {
    setChats((prev) => [...prev, chat]);
  };

  return (
    <AssistantChatContext.Provider value={{ chats, addChat }}>
      {children}
    </AssistantChatContext.Provider>
  );
};
