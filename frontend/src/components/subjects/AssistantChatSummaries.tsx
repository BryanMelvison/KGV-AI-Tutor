"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createChatSession, getChatSessions, ChatSession } from "@/api/chat";

const AssistantChatSummaries = () => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const subject = typeof params.subject === "string" ? params.subject : "";
  const chapter = typeof params.chapter === "string" ? params.chapter : "";

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!subject || !chapter) return;
        const sessions = await getChatSessions(subject, chapter);
        setChats(sessions);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }
    };

    fetchChats();
  }, [subject, chapter]);

  const handleCreateChat = async () => {
    if (!newChatTitle.trim()) return;

    try {
      setLoading(true);
      const sessionId = await createChatSession(newChatTitle, subject, chapter);

      setChats((prev) => [
        {
          sessionId,
          sessionName: newChatTitle,
          timestamp: new Date().toISOString(),
          message: null,
        },
        ...prev,
      ]);

      setNewChatTitle("");
      setIsModalOpen(false);

      router.push(
        `/student/subjects/${subject}/${chapter}/assistant-chat?sessionId=${sessionId}`
      );
    } catch (err) {
      console.error("Failed to create chat session:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    return isToday
      ? new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(date)
      : new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
        }).format(date);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Assistant Chats</h2>
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => setIsModalOpen(true)}
        >
          + New Chat
        </button>
      </div>

      {chats.length ? (
        chats.map((chat) => (
          <Link
            key={chat.sessionId}
            href={`/student/subjects/${subject}/${chapter}/assistant-chat?sessionId=${chat.sessionId}`}
            className="block border-b last:border-none hover:bg-gray-50 rounded p-3 transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-base">{chat.sessionName}</h3>
              <span className="text-xs text-[#747479]">
                {formatTimestamp(chat.timestamp)}
              </span>
            </div>
            <p className="text-sm text-[#747479]">
              {chat.message || "No summary yet"}
            </p>
          </Link>
        ))
      ) : (
        <div className="text-sm text-gray-500 text-center py-6">
          No chats yet, create one ✨
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Start a New Chat
            </h3>
            <input
              type="text"
              className="w-full border rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter chat title"
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChat}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantChatSummaries;
