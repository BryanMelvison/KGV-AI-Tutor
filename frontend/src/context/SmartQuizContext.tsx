"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

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
  openQuiz: () => void;
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

const MOCK_QUESTIONS: Question[] = [
  {
    id: "1",
    title: "How to Budget and Forecast for your Business?",
    description: "Lorem ipsum dolor sit amet...",
    options: [
      { letter: "A", title: "Option A" },
      { letter: "B", title: "Option B" },
      { letter: "C", title: "Option C" },
      { letter: "D", title: "Option D" },
    ],
  },
  {
    id: "2",
    title: "How to Budget and Forecast for your Business? Part 2",
    description: "Lorem ipsum dolor sit amet...",
    options: [
      { letter: "A", title: "Option A" },
      { letter: "B", title: "Option B" },
      { letter: "C", title: "Option C" },
      { letter: "D", title: "Option D" },
    ],
  },
];

export function SmartQuizProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);

  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex] || null,
    [questions, currentQuestionIndex]
  );

  const addMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, { text, sender: "user" }]);
    setInputValue("");
  }, []);

  const openQuiz = useCallback(() => setIsOpen(true), []);
  const closeQuiz = useCallback(() => setIsOpen(false), []);

  const restartQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption("");
    setInputValue("");
    setMessages([]);
  }, []);

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
