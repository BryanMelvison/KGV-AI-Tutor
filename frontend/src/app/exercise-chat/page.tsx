"use client";

// LEGACYYYYY

import ExerciseChat from "@/components/chat/ExerciseChat";

export default function ExerciseChatPage() {
  const exerciseData = {
    title: "Exercise 1",
    subtitle: "Practice your analytical and writing skills",
    questions: [
      { number: "1", title: "Analyze the Following Scenario" },
      { number: "2", title: "Identify Key Issues in the Case" },
      { number: "3", title: "Propose a Solution and Justify Your Answer" },
    ],
  };

  return (
    <ExerciseChat
      title={exerciseData.title}
      questions={exerciseData.questions}
    />
  );
}
