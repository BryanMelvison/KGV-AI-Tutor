"use client";

import { useState } from "react";
import { Message } from "@/interfaces/Message";
import ChatContainer from "@/components/chat/ChatContainer";
import { AIResponse, clearMemory } from "@/api/chat";
import { useSearchParams, useParams } from "next/navigation";

const AIChat = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const sessionId = searchParams.get("sessionId") || "default";
  const subject =
    typeof params.subject === "string" ? params.subject : "general";
  const chapter =
    typeof params.chapter === "string" ? params.chapter : "general";

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showClearMessage, setShowClearMessage] = useState(false);

  const handleSend = async (message: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);

    try {
      const response = await AIResponse(message, sessionId, subject, chapter);
      console.log(response);
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
      await clearMemory(sessionId);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
    setTimeout(() => {
      setShowClearMessage(false);
    }, 2000);
  };

  const headerContent = (
    <div className="pt-4">
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
        <h2 className="text-2xl font-semibold ">AI Chat</h2>
        <p className="text-gray-500">Chat with our AI assistant</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
      <ChatContainer
        messages={messages}
        isLoading={isLoading}
        onSend={handleSend}
        onClear={handleClear}
        headerContent={headerContent}
      />
    </div>
  );
};

export default AIChat;
