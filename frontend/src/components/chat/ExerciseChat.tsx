"use client";

import React, { useState } from "react";
import ChatContainer from "./ChatContainer";
import { Message } from "@/interfaces/Message";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Question {
  number: string;
  title: string;
}

interface ExerciseChatProps {
  title: string;
  questions: Question[];
}

const ExerciseChat = ({ title, questions }: ExerciseChatProps) => {
  const router = useRouter();
  const params = useParams();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chatHistories, setChatHistories] = useState<{
    [key: number]: Message[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [showConfirmQuit, setShowConfirmQuit] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const messages = chatHistories[currentQuestionIndex] || [];

  const searchParams = useSearchParams();
  const selectedExercise = searchParams.get("exercise") || "A";

  const allCompleted = questions.every(
    (_, index) => chatHistories[index]?.length > 0
  );

  const handleSend = (message: string) => {
    if (!message.trim()) return;
    setIsLoading(true);
    setChatHistories((prev) => ({
      ...prev,
      [currentQuestionIndex]: [
        ...(prev[currentQuestionIndex] || []),
        { text: message, sender: "user" },
      ],
    }));

    setTimeout(() => {
      setChatHistories((prev) => ({
        ...prev,
        [currentQuestionIndex]: [
          ...prev[currentQuestionIndex],
          { text: "This is a sample AI response.", sender: "assistant" },
        ],
      }));
      setIsLoading(false);
    }, 0);
  };

  const handleQuitExercise = () => {
    const subject = params.subject;
    const chapter = params.chapter;

    if (allCompleted) {
      toast.success("Exercise submitted successfully!");
      if (typeof subject === "string" && typeof chapter === "string") {
        router.push(`/student/subjects/${subject}/${chapter}`);
      }
      // TBC: Add exercise submission logic
    } else {
      setShowConfirmQuit(true);
    }
  };

  const confirmQuit = () => {
    const subject = params.subject;
    const chapter = params.chapter;
    setShowConfirmQuit(false);
    if (typeof subject === "string" && typeof chapter === "string") {
      router.push(`/student/subjects/${subject}/${chapter}`);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0)
      setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1)
      setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const openSelector = () => {
    setIsSelectorOpen(true);
  };

  const selectQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setIsSelectorOpen(false);
  };

  const isCompleted = messages.length > 0;

  const headerContent = (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center my-4">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>

        <div className="flex gap-3">
          <button
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-all
            bg-gray-200 text-gray-800
            hover:bg-gray-300 hover:shadow
            active:bg-gray-400 active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Previous
          </button>
          <button
            onClick={openSelector}
            className={`px-4 py-2 rounded-lg font-medium transition-all
            bg-blue-200 text-blue-800
            hover:bg-blue-300 hover:shadow
            active:bg-blue-400 active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
          >
            Q{currentQuestion.number} {isCompleted ? "(Done)" : ""}
          </button>

          <button
            onClick={goToNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all
            bg-gray-200 text-gray-800
            hover:bg-gray-300 hover:shadow
            active:bg-gray-400 active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Next
          </button>
          <button
            onClick={handleQuitExercise}
            className={`px-4 py-2 rounded-lg transition-colors font-medium
            ${
              allCompleted
                ? "bg-green-50 text-green-600 hover:bg-green-100"
                : "bg-red-50 text-red-500 hover:bg-red-100"
            }
          `}
          >
            {allCompleted ? "Submit Exercise" : "Quit Exercise"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">
          {currentQuestion.number}. {currentQuestion.title}
        </h2>
      </div>
    </>
  );

  if (!questions || questions.length === 0) {
    return (
      <div className="h-screen flex justify-center items-center text-gray-600 text-lg">
        Loading questions for exercise {selectedExercise}...
      </div>
    );
  }

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

      {/* Question Selector Modal */}
      {isSelectorOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              Select a Question
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const isCompleted = chatHistories[index]?.length > 0;
                const isActive = index === currentQuestionIndex;

                return (
                  <div
                    key={question.number}
                    className={`relative w-12 h-12 flex items-center justify-center rounded-md text-sm font-semibold cursor-pointer border
                      ${
                        isCompleted
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

            {/* Modal Actions */}
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
      {showConfirmQuit && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center space-y-4">
            <h3 className="text-lg font-semibold text-red-600">
              Are you sure you want to quit?
            </h3>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmQuit(false)}
                className="px-4 py-2 rounded-md text-sm text-gray-800 bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmQuit}
                className="px-4 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseChat;
