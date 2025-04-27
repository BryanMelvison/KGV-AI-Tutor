import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useQuiz } from "@/context/SmartQuizContext";
import SmartQuizQuestion from "./SmartQuizQuestion";
import SmartQuizHeader from "./SmartQuizHeader";
import SmartQuizOptions from "./SmartQuizOptions";
import SelectedAnswer from "./SelectedAnswer";
import SmartQuizInput from "./SmartQuizInput";
import TimeUpDialog from "./TimeUpDialog";
import Card from "../ui/Card";
import CloseButton from "../ui/CloseButton";
import Messages from "../Messages";
import { useRef, useEffect, useState, Fragment, useCallback } from "react";
import confetti from "canvas-confetti";
<<<<<<< Updated upstream
=======
import { FaSpinner } from "react-icons/fa";
import SmartQuizReview from "./SmartQuizReview";
import { askSmartQuizAssistant } from "@/api/exercise";
import TypingIndicator from "../chat/TypingIndicator";
import { Message } from "@/interfaces/Message";
import { AIResponse } from "@/api/chat";
>>>>>>> Stashed changes

interface SmartQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SmartQuizModal = ({ isOpen, onClose }: SmartQuizModalProps) => {
  const {
    selectedOption,
    setSelectedOption,
    inputValue,
    setInputValue,
    currentQuestion,
    questions,
    messages,
    addMessage,
    setMessages,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    isLoading,
    restartQuiz,
  } = useQuiz();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
<<<<<<< Updated upstream
=======
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

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setMessages((prev) => [...prev, { text: "...", sender: "assistant" }]);

    try {
      const assistantResponse = await AIResponse(
        userMessage,
        "smartquiz",
        "biology",
        "life-processes"
      );

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: assistantResponse, sender: "assistant" },
      ]);
    } catch (error) {
      console.error("Error getting assistant response:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: "Sorry, failed to get a response.", sender: "assistant" },
      ]);
    }
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
>>>>>>> Stashed changes

  useEffect(() => {
    if (isOpen) {
      setIsFinished(false);
      restartQuiz();
      setTimeRemaining(10 * 60);
      setShowTimeUpDialog(false);
    }
  }, [isOpen, restartQuiz]);

  // Handle timer
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isOpen && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            setShowTimeUpDialog(true);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, timeRemaining]);

  const handleTimeUpClose = useCallback(() => {
    setShowTimeUpDialog(false);
    onClose();
  }, [onClose]);

  // Scroll to message view
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const handleSubmit = useCallback(() => {
    if (inputValue.trim()) {
      addMessage(inputValue);
    }
  }, [inputValue, addMessage]);

  // Scroll to Question Title for subsequent questions
  const questionTitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    questionTitleRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentQuestionIndex]);

  const handleSubmitAnswer = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption("");
      setMessages([]);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [
    currentQuestionIndex,
    questions.length,
    setCurrentQuestionIndex,
    setSelectedOption,
    setMessages,
  ]);

  if (isLoading || !currentQuestion) {
    return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow p-6 animate-pulse space-y-4 w-[400px] text-center">
            <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto" />
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-3/4 mx-auto" />
          </div>
        </div>
      </Dialog>
    );
  }

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

          <div className="fixed inset-0">
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
                <DialogPanel className="w-[50%] h-[80vh] min-w-[400px] max-w-[800px] min-h-[500px] max-h-[600px] transform transition-all">
                  <Card className="h-full flex flex-col rounded-3xl overflow-hidden bg-[#F5F7FF]">
                    <div className="relative flex items-center py-3 border-b shrink-0 bg-white">
                      <div className="absolute right-4">
                        <CloseButton onClick={onClose} />
                      </div>
                      <DialogTitle className="w-full text-center text-xl font-semibold ">
                        Smart Quiz
                      </DialogTitle>
                    </div>

                    {!isFinished && (
                      <div className="px-6 pt-4 shrink-0">
                        <SmartQuizHeader
                          timeRemaining={timeRemaining}
                          currentQuestion={currentQuestionIndex + 1}
                          totalQuestions={questions.length}
                        />
                      </div>
                    )}

                    <div
                      className={`flex-1 overflow-y-auto ${
                        isFinished &&
                        "flex flex-col  justify-center items-center"
                      }`}
                    >
                      <div className="px-6 pt-4">
                        {isFinished ? (
                          <div className="flex flex-1 flex-col items-center justify-center space-y-4 text-center">
                            <h2 className="text-2xl font-bold text-green-600">
                              🎉 Quiz Completed!
                            </h2>
                            <p className="text-gray-500">
                              You finished all the questions, great job!
                            </p>
                            <p className="text-md font-semibold ">
                              Your score: {currentQuestionIndex + 1} /{" "}
                              {questions.length}
                            </p>
                            <button
                              onClick={onClose}
                              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                            >
                              Close
                            </button>
                          </div>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>

<<<<<<< Updated upstream
                    {!isFinished && (
                      <div className="p-4 border-t rounded-b-3xl bg-white shrink-0">
                        <SmartQuizInput
                          value={inputValue}
                          onChange={setInputValue}
                          onSubmit={handleSubmit}
                        />
                      </div>
=======
                    {!subject ? (
                      <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-6 text-center">
                        <h3 className="text-lg font-semibold text-gray-700">
                          Pick a subject to start your Smart Quiz
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md">
                          {SUBJECTS.map((s) => {
                            const isDisabled =
                              s === "Chemistry" || s === "Physics";

                            return (
                              <button
                                key={s}
                                onClick={() => handleSelectSubject(s)}
                                disabled={isDisabled}
                                className="
                              bg-white border border-gray-200 shadow-sm hover:shadow-md transition
                              rounded-xl px-6 py-4 flex flex-col items-center justify-center space-y-2
                              text-gray-700 hover:text-sky-600
                              disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:text-gray-700
                              "
                              >
                                <div className="text-3xl">
                                  {s === "Biology" && "🧬"}
                                  {s === "Chemistry" && "⚗️"}
                                  {s === "Physics" && "🔭"}
                                </div>
                                <div>
                                  <span className="font-medium">{s}</span>
                                  {isDisabled && (
                                    <>
                                      <div />
                                      <span className="text-xs italic text-gray-400">
                                        Coming Soon
                                      </span>
                                    </>
                                  )}
                                </div>
                              </button>
                            );
                          })}
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

                        <div className="flex-1 overflow-y-auto px-6 pt-4 max-h-[400px] overflow-y-auto ">
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
                          <div className="space-y-2 pr-2">
                            {messages.map((message, index) => (
                              <div key={index}>
                                {message.text === "..." ? (
                                  <TypingIndicator />
                                ) : (
                                  <Messages messages={[message]} />
                                )}
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>
                        </div>

                        <div className="p-4 bg-white border-t">
                          <SmartQuizInput
                            value={inputValue}
                            onChange={setInputValue}
                            onSubmit={handleSubmit}
                          />
                        </div>
                      </>
>>>>>>> Stashed changes
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
