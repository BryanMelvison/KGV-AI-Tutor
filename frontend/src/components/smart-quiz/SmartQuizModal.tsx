"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { ReviewAnswer, useQuiz } from "@/context/SmartQuizContext";
import { fetchSmartQuizQuestions } from "@/api/exercise";
import { useRef, useEffect, useState, Fragment } from "react";
import SmartQuizQuestion from "./SmartQuizQuestion";
import SmartQuizHeader from "./SmartQuizHeader";
import SmartQuizOptions from "./SmartQuizOptions";
import SelectedAnswer from "./SelectedAnswer";
import SmartQuizInput from "./SmartQuizInput";
import TimeUpDialog from "./TimeUpDialog";
import Card from "../ui/Card";
import CloseButton from "../ui/CloseButton";
import Messages from "../Messages";
import confetti from "canvas-confetti";
import { FaSpinner } from "react-icons/fa";
import SmartQuizReview from "./SmartQuizReview";

const SUBJECTS = ["Biology", "Chemistry", "Physics"];

const SmartQuizModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    selectedOption,
    setSelectedOption,
    inputValue,
    setInputValue,
    currentQuestion,
    questions,
    setQuestions,
    messages,
    addMessage,
    setMessages,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    isLoading,
    setIsLoading,
    verifyAnswer,
  } = useQuiz();

  const [subject, setSubject] = useState<string | null>(null);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60);
  const [score, setScore] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const questionTitleRef = useRef<HTMLDivElement>(null);

  const [reviewAnswers, setReviewAnswers] = useState<ReviewAnswer[]>([]);

  const handleSelectSubject = async (selected: string) => {
    setSubject(selected);
    setIsLoading(true);
    const data = await fetchSmartQuizQuestions(selected);
    setQuestions(data);
    setCurrentQuestionIndex(0);
    setSelectedOption("");
    setInputValue("");
    setMessages([]);
    setIsLoading(false);
    setTimeRemaining(10 * 60);
  };

  const handleTimeUpClose = () => {
    setShowTimeUpDialog(false);
    onClose();
  };

  const handleSubmit = () => {
    if (inputValue.trim()) addMessage(inputValue);
  };

  const handleSubmitAnswer = async () => {
    const result = await verifyAnswer(currentQuestion.id, selectedOption);
    setReviewAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selected: selectedOption,
        correct: result.correctLetter,
        explanation: result.explanation,
      },
    ]);

    if (result.correct) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption("");
      setMessages([]);
    } else {
      setIsFinished(true);
      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
    }
  };

  useEffect(() => {
    if (messages.length > 0)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    questionTitleRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (isOpen) {
      setScore(0);
      setIsFinished(false);
      setSubject(null);
      setQuestions([]);
      setMessages([]);
      setSelectedOption("");
      setTimeRemaining(10 * 60);
      setShowTimeUpDialog(false);
      setReviewAnswers([]);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && subject && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          const updated = prev - 1;
          if (updated <= 0) {
            setShowTimeUpDialog(true);
            return 0;
          }
          return updated;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, subject, timeRemaining]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-[50%] max-w-[800px] min-w-[400px] transform overflow-hidden bg-white rounded-2xl shadow-xl transition-all">
                  <Card className="h-full flex flex-col bg-[#F5F7FF]">
                    <div className="relative flex items-center justify-between py-3 px-6 border-b bg-white">
                      <DialogTitle className="text-xl font-semibold text-center w-full">
                        Smart Quiz
                      </DialogTitle>
                      <div className="absolute right-4 top-3">
                        <CloseButton onClick={onClose} />
                      </div>
                    </div>

                    {!subject ? (
                      <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-6 text-center">
                        <h3 className="text-lg font-semibold text-gray-700">
                          Pick a subject to start your Smart Quiz
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md">
                          {SUBJECTS.map((s) => (
                            <button
                              key={s}
                              onClick={() => handleSelectSubject(s)}
                              className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition rounded-xl px-6 py-4 flex flex-col items-center justify-center space-y-2 text-gray-700 hover:text-sky-600"
                            >
                              <div className="text-3xl">
                                {s === "Biology" && "🧬"}
                                {s === "Chemistry" && "⚗️"}
                                {s === "Physics" && "🔭"}
                              </div>
                              <span className="font-medium">{s}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : isFinished ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                        <h2 className="text-2xl font-bold text-green-600">
                          🎉 Quiz Completed!
                        </h2>
                        <p className="text-gray-500">
                          Great job! You’ve finished all questions.
                        </p>
                        <p className="text-md font-semibold">
                          Score: {score} / {questions.length}
                        </p>

                        <div className="mt-4 flex justify-center gap-4">
                          {/* Review Modal Toggle Button */}
                          <button
                            onClick={() => setShowReviewModal(true)}
                            className="px-4 py-2 bg-white text-sky-600 border border-sky-600 rounded-lg hover:bg-sky-50 transition"
                          >
                            Review Answers
                          </button>

                          {/* Close Quiz Button */}
                          <button
                            onClick={onClose}
                            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                          >
                            Close
                          </button>
                        </div>

                        {/* Review Modal */}
                        <Transition appear show={showReviewModal} as={Fragment}>
                          <Dialog
                            as="div"
                            className="relative z-50"
                            onClose={() => setShowReviewModal(false)}
                          >
                            <TransitionChild
                              as={Fragment}
                              enter="ease-out duration-300"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="ease-in duration-200"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <div className="fixed inset-0 bg-black/30" />
                            </TransitionChild>

                            <div className="fixed inset-0 overflow-y-auto">
                              <div className="flex min-h-full items-center justify-center p-4">
                                <TransitionChild
                                  as={Fragment}
                                  enter="ease-out duration-300"
                                  enterFrom="opacity-0 scale-95"
                                  enterTo="opacity-100 scale-100"
                                  leave="ease-in duration-200"
                                  leaveFrom="opacity-100 scale-100"
                                  leaveTo="opacity-0 scale-95"
                                >
                                  <DialogPanel className="w-full max-w-[1024px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                      <DialogTitle className="text-xl font-semibold text-center w-full">
                                        Quiz Review
                                      </DialogTitle>
                                      <CloseButton
                                        onClick={() =>
                                          setShowReviewModal(false)
                                        }
                                      />
                                    </div>
                                    <SmartQuizReview
                                      reviewAnswers={reviewAnswers}
                                      questions={questions}
                                    />
                                  </DialogPanel>
                                </TransitionChild>
                              </div>
                            </div>
                          </Dialog>
                        </Transition>
                      </div>
                    ) : isLoading || !currentQuestion ? (
                      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <FaSpinner className="animate-spin text-sky-500 text-3xl" />
                        <p className="text-gray-500">Loading quiz...</p>
                      </div>
                    ) : (
                      <>
                        <div className="px-6 pt-4">
                          <SmartQuizHeader
                            timeRemaining={timeRemaining}
                            currentQuestion={currentQuestionIndex + 1}
                            totalQuestions={questions.length}
                          />
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 pt-4">
                          <div ref={questionTitleRef}>
                            <SmartQuizQuestion
                              title={currentQuestion.title}
                              description={currentQuestion.description}
                            />
                          </div>
                          <SmartQuizOptions
                            options={currentQuestion.options}
                            selectedOption={selectedOption}
                            onSelect={setSelectedOption}
                          />
                          <SelectedAnswer
                            letter={selectedOption}
                            title={
                              currentQuestion.options.find(
                                (o) => o.letter === selectedOption
                              )?.title || ""
                            }
                            onSubmit={handleSubmitAnswer}
                          />
                          <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="px-4 py-2 rounded-md text-gray-500 bg-[#F5F7FF]">
                                Not sure? Ask AI Assistant for help!
                              </span>
                            </div>
                          </div>
                          <Messages
                            messages={messages}
                            className="max-h-[300px]"
                          />
                          <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white border-t">
                          <SmartQuizInput
                            value={inputValue}
                            onChange={setInputValue}
                            onSubmit={handleSubmit}
                          />
                        </div>
                      </>
                    )}
                  </Card>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      <TimeUpDialog isOpen={showTimeUpDialog} onClose={handleTimeUpClose} />
    </>
  );
};

export default SmartQuizModal;
