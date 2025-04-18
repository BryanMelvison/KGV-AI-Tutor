"use client";

import Link from "next/link";
import { useState } from "react";
import { useAssistantChat } from "@/context/AssistantChatContext";
import { useParams, useRouter } from "next/navigation";
import { createChatSession } from "@/api/chat";

const AssistantChatSummaries = () => {
  const { chats, addChat } = useAssistantChat();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const handleCreateChat = async () => {
    if (!newChatTitle.trim()) return;

    const subject = params.subject;
    const chapter = params.chapter;

    if (typeof subject !== "string" || typeof chapter !== "string") {
      console.error("Missing subject or chapter in URL");
      return;
    }

    try {
      setLoading(true);

      const sessionId = await createChatSession(newChatTitle, subject, chapter);

      addChat({
        id: sessionId,
        title: newChatTitle,
        summary: "New chat, no summary yet",
        time: new Date().toLocaleTimeString(),
      });

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

  return (
    <div className="bg-white p-5 rounded-xl shadow-md flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold ">Assistant Chats</h2>
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
            key={chat.id}
            href={`${window.location.pathname}/assistant-chat?sessionId=${chat.id}`}
            className="block border-b last:border-none last:mb-0 hover:bg-gray-50 rounded p-3 transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-base ">{chat.title}</h3>
              <span className="text-xs text-[#747479]">{chat.time}</span>
            </div>
            <p className="text-sm text-[#747479]">{chat.summary}</p>
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
              className="w-full border rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantChatSummaries;
