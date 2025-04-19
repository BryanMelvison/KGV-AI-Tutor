"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { getExerciseMCQAnswer, fetchSmartQuizQuestions } from "@/api/exercise";

interface Option {
  letter: string;
  title: string;
}

interface Question {
  id: string;
  title: string;
  description: string;
  options: Option[];
}

interface Message {
  text: string;
  sender: "user" | "assistant";
}

interface SmartQuizContextType {
  isOpen: boolean;
  openQuiz: (subject?: string) => void;
  closeQuiz: () => void;
  selectedOption: string | undefined;
  setSelectedOption: (option: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  currentQuestion: Question | null;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  messages: Message[];
  addMessage: (message: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (value: number | ((prev: number) => number)) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  restartQuiz: () => void;
}

const SmartQuizContext = createContext<SmartQuizContextType | undefined>(
  undefined
);

export function SmartQuizProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex] || null,
    [questions, currentQuestionIndex]
  );

  const addMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, { text, sender: "user" }]);
    setInputValue("");
  }, []);

  const fetchQuestions = async (): Promise<Question[]> => {
    return await fetchSmartQuizQuestions();
  };

  const verifyAnswer = useCallback(
    async (questionId: number, selectedLetter: string) => {
      try {
        const answerData = await getExerciseMCQAnswer(questionId);
        const correctLetter = ["A", "B", "C", "D"][answerData.correct_option];
        const isCorrect = selectedLetter === correctLetter;

        console.log("Correct Option:", correctLetter);
        return {
          correct: isCorrect,
          correctLetter,
          explanation: answerData.options[answerData.correct_option],
        };
      } catch (error) {
        console.error("Failed to verify answer:", error);
        return { correct: false, correctLetter: "", explanation: "" };
      }
    },
    []
  );

  const restartQuiz = useCallback(async () => {
    setIsLoading(true);

    const subject = "Biology";

    const fetchedQuestions = await fetchSmartQuizQuestions(subject);
    setQuestions(fetchedQuestions);

    setCurrentQuestionIndex(0);
    setSelectedOption("");
    setInputValue("");
    setMessages([]);

    setIsLoading(false);
  }, []);

  const openQuiz = useCallback(async (subject = "Biology") => {
    setIsOpen(true);
    setIsLoading(true);

    const fetchedQuestions = await fetchSmartQuizQuestions(subject);
    setQuestions(fetchedQuestions);

    setCurrentQuestionIndex(0);
    setSelectedOption("");
    setInputValue("");
    setMessages([]);

    setIsLoading(false);
  }, []);

  const closeQuiz = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      isOpen,
      openQuiz,
      closeQuiz,
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
      restartQuiz,
    }),
    [
      isOpen,
      openQuiz,
      closeQuiz,
      selectedOption,
      inputValue,
      currentQuestion,
      questions,
      messages,
      addMessage,
      currentQuestionIndex,
      isLoading,
      verifyAnswer,
      restartQuiz,
    ]
  );

  return (
    <SmartQuizContext.Provider value={value}>
      {children}
    </SmartQuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(SmartQuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a SmartQuizProvider");
  }
  return context;
}
