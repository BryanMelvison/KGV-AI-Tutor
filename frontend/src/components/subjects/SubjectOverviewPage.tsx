"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import MasteryChecklist from "./MasteryChecklist";
import ExerciseGrid from "./ExerciseGrid";
import ProgressBar from "./ProgressBar";
import AssistantChatSummaries from "./AssistantChatSummaries";
import ExerciseChat from "../chat/ExerciseChat";
import { fetchExerciseQuestions } from "@/api/exerciseApi";
import { ChapterData } from "@/api/mockChapter";
import { unslugify } from "@/helpers/slugify";
import UnlockBox from "./UnlockBox";

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
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
        <ExerciseChat
          title={`Exercise ${exerciseLetter}`}
          questions={questions}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MasteryChecklist items={data.mastery} status={data.mastery_status} />
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
