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

  useEffect(() => {
    if (isOpen) {
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
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="text-center">Loading...</div>
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
                <DialogPanel className="w-[50%] h-[80vh] min-w-[400px] max-w-[800px] min-h-[500px] max-h-[600px] transform transition-all">
                  <Card className="h-full flex flex-col rounded-3xl overflow-hidden bg-[#F5F7FF]">
                    <div className="relative flex items-center py-3 border-b shrink-0 bg-white">
                      <div className="absolute right-4">
                        <CloseButton onClick={onClose} />
                      </div>
                      <DialogTitle className="w-full text-center text-xl font-semibold text-[#17171F]">
                        Smart Quiz
                      </DialogTitle>
                    </div>

                    <div className="px-6 pt-4 shrink-0">
                      <SmartQuizHeader
                        timeRemaining={timeRemaining}
                        currentQuestion={currentQuestionIndex + 1}
                        totalQuestions={questions.length}
                      />
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <div className="px-6 pt-4">
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
                    </div>

                    <div className="p-4 border-t rounded-b-3xl bg-white shrink-0">
                      <SmartQuizInput
                        value={inputValue}
                        onChange={setInputValue}
                        onSubmit={handleSubmit}
                      />
                    </div>
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
