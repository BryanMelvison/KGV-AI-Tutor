"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import MasteryChecklist from "./MasteryChecklist";
import ExerciseGrid from "./ExerciseGrid";
import ProgressBar from "./ProgressBar";
import UnlockBox from "./UnlockBox";
import AssistantChatSummaries from "./AssistantChatSummaries";
import ExerciseChat from "../chat/ExerciseChat";
import { fetchExerciseQuestions } from "@/api/exerciseApi";
import { ChapterData } from "@/api/mockChapter";
import { unslugify } from "@/helpers/slugify";

interface SubjectOverviewPageProps {
  data: ChapterData;
}

const SubjectOverviewPage = ({ data }: SubjectOverviewPageProps) => {
  const searchParams = useSearchParams();
  const exerciseLetter = searchParams.get("exercise");
  const { subject, chapter } = useParams();

  const [questions, setQuestions] = useState<
    { number: string; title: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  console.log(
    exerciseLetter && typeof subject === "string" && typeof chapter === "string"
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      if (
        exerciseLetter &&
        typeof subject === "string" &&
        typeof chapter === "string"
      ) {
        setLoading(true);
        const result = await fetchExerciseQuestions(
          subject,
          chapter,
          exerciseLetter
        );
        console.log("ini result cok", result);
        setQuestions(result);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [exerciseLetter, subject, chapter]);

  if (exerciseLetter) {
    if (loading || questions.length === 0) {
      return (
        <div className="p-6 text-gray-500">
          Loading Exercise {exerciseLetter}...
        </div>
      );
    }

    return (
      <ExerciseChat
        title={`Exercise ${exerciseLetter}`}
        questions={questions}
      />
    );
  }

  return (
    <div className="space-y-6">
      <MasteryChecklist items={data.mastery} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ExerciseGrid exercises={data.exercises} />
          <ProgressBar progress={data.progress} />
        </div>
        <UnlockBox />
      </div>
      <AssistantChatSummaries chats={data.chats} />
    </div>
  );
};

export default SubjectOverviewPage;
