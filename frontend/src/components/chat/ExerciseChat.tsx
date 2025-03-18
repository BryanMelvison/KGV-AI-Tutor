"use client";

import React, { useState } from "react";
import ChatContainer from "./ChatContainer";
import { Message } from "@/interfaces/Message";

interface Question {
  number: string;
  title: string;
}

interface ExerciseChatProps {
  title: string;
  subtitle: string;
  questions: Question[];
}

const ExerciseChat = ({ title, subtitle, questions }: ExerciseChatProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chatHistories, setChatHistories] = useState<{
    [key: number]: Message[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const messages = chatHistories[currentQuestionIndex] || [];

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
    }, 1000);
  };

  const handleClear = () => {
    setChatHistories((prev) => ({ ...prev, [currentQuestionIndex]: [] }));
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={openSelector}
            className="px-4 py-2 bg-blue-200 text-blue-800 rounded-lg"
          >
            Q{currentQuestion.number} {isCompleted ? "(Done)" : ""}
          </button>
          <button
            onClick={goToNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
          <button className="px-4 py-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            Quit Exercise
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          {currentQuestion.number}. {currentQuestion.title}
        </h2>
      </div>
    </>
  );

  return (
    <>
      <ChatContainer
        messages={messages}
        isLoading={isLoading}
        onSend={handleSend}
        onClear={handleClear}
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
    </>
  );
};

export default ExerciseChat;