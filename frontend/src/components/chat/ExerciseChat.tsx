"use client";

import React, { useState } from "react";
import ChatContainer from "./ChatContainer";
import { Message } from "@/interfaces/Message";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getExerciseAIResponse } from "@/api/exerciseApi";
import confetti from "canvas-confetti";

interface Question {
  number: string;
  title: string;
  answer: string;
  id: number;
  isCompleted?: boolean;
}

interface ExerciseChatProps {
  title: string;
  questions: Question[];
}

const ExerciseChat = ({ title, questions }: ExerciseChatProps) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chatHistories, setChatHistories] = useState<{
    [key: number]: Message[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [showConfirmQuit, setShowConfirmQuit] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const messages = chatHistories[currentQuestionIndex] || [];

  const selectedExercise = searchParams.get("exercise") || "A";
  const allCompleted = questions.every((q) => q.isCompleted);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    setIsLoading(true);

    setChatHistories((prev) => ({
      ...prev,
      [currentQuestionIndex]: [
        ...(prev[currentQuestionIndex] || []),
        { text: message, sender: "user" },
      ],
    }));

    try {
      // console.log("qna data", currentQuestion);
      const response = await getExerciseAIResponse(
        currentQuestion.title,
        currentQuestion.answer,
        message
      );

      const feedback = `📊 Score: ${response.score}/10 💭 Feedback: ${response.reason} 🛠️ Comment: ${response.comment} 💡 Hint: ${response.hint}`;

      questions[currentQuestionIndex].isCompleted = response.score >= 8;

      setChatHistories((prev) => ({
        ...prev,
        [currentQuestionIndex]: [
          ...prev[currentQuestionIndex],
          { text: feedback, sender: "assistant" },
        ],
      }));

      if (response.score >= 8) {
        setShowCompletionPopup(true);
        confetti({
          particleCount: 200,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((i) => i - 1);
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1)
      setCurrentQuestionIndex((i) => i + 1);
    setShowCompletionPopup(false);
  };

  const handleQuitExercise = () => {
    setShowConfirmQuit(true);
  };

  const confirmQuit = () => {
    setShowConfirmQuit(false);
    toast.success("Exercise submitted!");
    const { subject, chapter } = params;
    if (typeof subject === "string" && typeof chapter === "string") {
      router.push(`/student/subjects/${subject}/${chapter}`);
    }
  };

  const openSelector = () => setIsSelectorOpen(true);
  const selectQuestion = (i: number) => {
    setCurrentQuestionIndex(i);
    setIsSelectorOpen(false);
  };

  const headerContent = (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center my-4">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <div className="flex gap-3">
          <button
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={openSelector}
            className="px-4 py-2 rounded-lg bg-blue-200 text-blue-800 hover:bg-blue-300"
          >
            Q{currentQuestion.number}{" "}
            {currentQuestion.isCompleted ? "(Done)" : ""}
          </button>
          <button
            onClick={goToNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={handleQuitExercise}
            className={`px-4 py-2 rounded-lg font-medium ${
              allCompleted
                ? "bg-green-50 text-green-600 hover:bg-green-100"
                : "bg-red-50 text-red-500 hover:bg-red-100"
            }`}
          >
            {allCompleted ? "Submit Exercise" : "Quit Exercise"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border">
        <h2 className="text-base font-semibold text-gray-900">
          {currentQuestion.number}. {currentQuestion.title}
        </h2>
      </div>
    </>
  );

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
      <ChatContainer
        messages={messages}
        isLoading={isLoading}
        onSend={handleSend}
        headerContent={headerContent}
        submitButtonText="Send"
        inputPlaceholder="Type your answer..."
      />

      {showCompletionPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md max-w-sm w-full text-center space-y-4">
            <h3 className="text-xl font-semibold text-green-600">Great job!</h3>
            <p className="text-gray-700">
              Correct Answer:{" "}
              <span className="font-medium">{currentQuestion.answer}</span>
            </p>
            <button
              onClick={goToNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Continue to Next Question
            </button>
          </div>
        </div>
      )}

      {showConfirmQuit && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center space-y-4">
            <h3 className="text-lg font-semibold text-red-600">
              Are you sure you want to quit?
            </h3>
            <p className="text-sm text-gray-600">
              Your answers will be submitted and will not be saved.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmQuit(false)}
                className="px-4 py-2 rounded-md bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmQuit}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Selector Modal */}
      {isSelectorOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              Select a Question
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const isActive = index === currentQuestionIndex;
                return (
                  <div
                    key={question.number}
                    className={`relative w-12 h-12 flex items-center justify-center rounded-md text-sm font-semibold cursor-pointer border
                      ${
                        question.isCompleted
                          ? "bg-green-500 text-white border-green-600"
                          : "bg-white text-gray-900 border-gray-300"
                      }
                      ${isActive ? "ring-2 ring-blue-500" : ""}
                    `}
                    onClick={() => selectQuestion(index)}
                  >
                    {question.number}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsSelectorOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseChat;
