"use client";

import { useQuiz } from "@/context/SmartQuizContext"; // Import the context hook
import SmartQuizModal from "@/components/smart-quiz/SmartQuizModal";

export default function DashboardPage() {
  const { isOpen, openQuiz, closeQuiz } = useQuiz(); // Use the context values

  return (
    <div>
      {/* Dashboard content */}
      <button
        onClick={openQuiz}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Start Quiz
      </button>

      {/* Quiz Modal */}
      <SmartQuizModal isOpen={isOpen} onClose={closeQuiz} />
    </div>
  );
}
