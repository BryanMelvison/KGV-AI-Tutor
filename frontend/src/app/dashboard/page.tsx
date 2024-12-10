"use client";

import { useQuiz } from "@/context/SmartQuizContext";
import { useRouter } from "next/navigation";
import SmartQuizModal from "@/components/smart-quiz/SmartQuizModal";

export default function DashboardPage() {
  const { isOpen, openQuiz, closeQuiz } = useQuiz();
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Quiz Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg text-[#17171F] font-medium mb-2">
              Smart Quiz
            </h3>
            <p className="text-gray-500 mb-4">Take our Smart Quiz.</p>
            <button
              onClick={openQuiz}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Quiz
            </button>
          </div>

          {/* AI Chat Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg text-[#17171F] font-medium mb-2">AI Chat</h3>
            <p className="text-gray-500 mb-4">
              Chat with our AI assistant for help and guidance.
            </p>
            <button
              onClick={() => router.push("/ai-chat")}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Open Chat
            </button>
          </div>

          {/* Exercise Chat Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg text-[#17171F] font-medium mb-2">
              Exercise Chat
            </h3>
            <p className="text-gray-500 mb-4">
              Get exercise recommendations and guidance.
            </p>
            <button
              onClick={() => router.push("/exercise-chat")}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Exercise Chat
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <SmartQuizModal isOpen={isOpen} onClose={closeQuiz} />
    </div>
  );
}
