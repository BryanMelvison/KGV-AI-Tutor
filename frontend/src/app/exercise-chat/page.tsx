"use client";

import ExerciseChat from "@/components/chat/ExerciseChat";

export default function ExerciseChatPage() {
  const exerciseData = {
    title: "Exercise 1: Critical Thinking",
    subtitle: "Practice your analytical and writing skills",
    question: {
      number: "1",
      title: "Analyze the Following Scenario",
      description:
        "In a world where technology is rapidly advancing, discuss the potential implications of artificial intelligence on the job market over the next decade. Consider both positive and negative impacts, and provide specific examples to support your arguments.",
    },
  };

  return (
    <ExerciseChat
      title={exerciseData.title}
      subtitle={exerciseData.subtitle}
      question={exerciseData.question}
    />
  );
}
