"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import ChatContainer from "@/components/chat/ChatContainer";
import { Message } from "@/interfaces/Message";
import {
  AIResponse,
  clearMemory,
  fetchChatHistory,
  getChatSessions,
} from "@/api/chat";

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showClearMessage, setShowClearMessage] = useState(false);
  const [chatTitle, setChatTitle] = useState("Assistant Chat");

  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const sessionId = searchParams.get("sessionId") || "default";
  const subject =
    typeof params.subject === "string" ? params.subject : "general";
  const chapter =
    typeof params.chapter === "string" ? params.chapter : "general";

  const fetchChatSessionTitle = async () => {
    if (!subject || !chapter || !sessionId) return;

    try {
      const sessions = await getChatSessions(subject, chapter);
      const current = sessions.find((s) => s.sessionId === sessionId);
      if (current) setChatTitle(current.sessionName);
    } catch (err) {
      console.error("Failed to fetch chat session name:", err);
    }
  };

  const loadHistory = async () => {
    try {
      const history = await fetchChatHistory(sessionId);
      const formatted: Message[] = history.map((msg: any) => ({
        text: msg.content,
        sender: msg.role === "human" ? "user" : "assistant",
      }));
      setMessages(formatted);
    } catch (err) {
      console.error("Error loading chat history:", err);
    }
  };

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);

    try {
      const response = await AIResponse(message, sessionId, subject, chapter);
      setMessages((prev) => [...prev, { text: response, sender: "assistant" }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    setShowClearMessage(true);
    try {
      await clearMemory(sessionId);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
    setTimeout(() => setShowClearMessage(false), 2000);
  };

  useEffect(() => {
    fetchChatSessionTitle();
    if (sessionId !== "default") loadHistory();
  }, [sessionId, subject, chapter]);

  const headerContent = (
    <div className="pt-4">
      {showClearMessage && (
        <div className="fixed top-0 left-0 right-0 bg-zinc-900 text-white text-center py-2 transition-all duration-300 z-50">
          Context cleared
        </div>
      )}

      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 gap-2"
          aria-label="Go back"
        >
          <FaArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-2xl font-semibold">{chatTitle}</h2>
          <p className="text-gray-500 text-sm">Chat with our AI assistant</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
      <ChatContainer
        messages={messages}
        isLoading={isLoading}
        onSend={sendMessage}
        onClear={clearChat}
        headerContent={headerContent}
      />
    </div>
  );
};

export default AIChat;
