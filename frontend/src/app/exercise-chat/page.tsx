"use client";

import ExerciseChat from "@/components/chat/ExerciseChat";

export default function ExerciseChatPage() {
  const exerciseData = {
    title: "Exercise 1",
    subtitle: "Practice your analytical and writing skills",
    question: {
      number: "1",
      title: "Analyze the Following Scenario",
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
