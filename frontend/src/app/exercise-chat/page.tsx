"use client";

import { useState, useEffect } from "react";
import ExerciseChat from "@/components/chat/ExerciseChat";
import { getExerciseData } from "@/api/exerciseApi";

interface ExerciseData {
  title: string;
  subtitle: string;
  question: {
    number: string;
    title: string;
  };
}

export default function ExerciseChatPage() {
  const [exerciseData, setExerciseData] = useState<ExerciseData>({
    title: "Exercise 1: Critical Thinking",
    subtitle: "Practice your analytical and writing skills",
    question: {
      number: "1",
      title: "Loading question...",
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getExerciseData();
        setExerciseData((prev) => ({
          ...prev,
          question: {
            number: "1",
            title: data.question,
          },
        }));
      } catch (error) {
        console.error("Failed to fetch exercise data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <ExerciseChat
      title={exerciseData.title}
      subtitle={exerciseData.subtitle}
      question={exerciseData.question}
      isLoading={isLoading}
    />
  );
}
