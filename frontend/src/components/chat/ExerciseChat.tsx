"use client";

import { useState } from "react";
import { Message } from "@/interfaces/Message";
import ChatContainer from "./ChatContainer";

interface ExerciseChatProps {
  title: string;
  subtitle: string;
  question: {
    number: string;
    title: string;
  };
}

const ExerciseChat = ({ title, subtitle, question }: ExerciseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (message: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);

    // Mock AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "This is a sample AI response.", sender: "assistant" },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const actions = (
    <button className="px-4 py-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
      Quit Exercise
    </button>
  );

  const headerContent = (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <div className="flex gap-3">{actions}</div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          {question.number}. {question.title}
        </h2>
      </div>
    </>
  );

  return (
    <ChatContainer
      messages={messages}
      isLoading={isLoading}
      onSend={handleSubmit}
      submitButtonText="Send"
      headerContent={headerContent}
      inputPlaceholder="Type your answer..."
    />
  );
};

export default ExerciseChat;
