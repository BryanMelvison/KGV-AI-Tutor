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

export interface ReviewAnswer {
  questionId: number;
  selected: string;
  correct: string;
  explanation: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  options: Option[];
}

interface Message {
  text: string;
  sender: "user" | "assistant";
}

export interface UserAnswer {
  questionId: string;
  selected: string;
  correct: string;
  explanation: string;
}

interface SmartQuizContextType {
  isOpen: boolean;
  openQuiz: () => void;
  closeQuiz: () => void;
  selectedSubject: string | null;
  setSelectedSubject: (subject: string) => void;

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

  verifyAnswer: (
    questionId: number,
    selectedLetter: string
  ) => Promise<{
    correct: boolean;
    correctLetter: string;
    explanation: string;
  }>;

  reviewAnswers: UserAnswer[];
  setReviewAnswers: React.Dispatch<React.SetStateAction<UserAnswer[]>>;
}

const SmartQuizContext = createContext<SmartQuizContextType | undefined>(
  undefined
);

export function SmartQuizProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState<UserAnswer[]>([]);

  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex] || null,
    [questions, currentQuestionIndex, selectedSubject, setSelectedSubject]
  );

  const addMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, { text, sender: "user" }]);
    setInputValue("");
  }, []);

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

  // const openQuiz = useCallback(async (subject = "Biology") => {
  //   setIsOpen(true);
  //   setIsLoading(true);

  //   const fetchedQuestions = await fetchSmartQuizQuestions(subject);
  //   setQuestions(fetchedQuestions);

  //   setCurrentQuestionIndex(0);
  //   setSelectedOption("");
  //   setInputValue("");
  //   setMessages([]);

  //   setIsLoading(false);
  // }, []);

  const openQuiz = useCallback(() => {
    setIsOpen(true);
    setIsFinished(false);
    setQuestions([]);
    setSelectedSubject(null);
  }, []);

  const closeQuiz = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      isOpen,
      openQuiz,
      closeQuiz,
      selectedSubject,
      setSelectedSubject,
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
      reviewAnswers,
      setReviewAnswers,
    }),
    [
      isOpen,
      openQuiz,
      closeQuiz,
      selectedSubject,
      setSelectedSubject,
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
      reviewAnswers,
      setReviewAnswers,
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
