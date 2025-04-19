import api from "@/helpers/axios";
import { getChapterNumber } from "@/api/chapter";

export interface Question {
  id: string;
  title: string;
  description: string;
  options: {
    letter: string;
    title: string;
  }[];
}

export interface MCQAnswerResponse {
  options: string[];
  correct_option: number;
}

export interface ExerciseAIRequest {
  question_title: string;
  question_answer: string;
  prompt: string;
}

export const fetchExerciseQuestions = async (
  subject: string,
  chapter: string,
  exercise: string
): Promise<Question[]> => {
  try {
    const chapter_num = await getChapterNumber(chapter);

    const { data } = await api.post(
      `/exercise/get-exercise-questions?subject=${subject}&chapter=${chapter_num}&exerciseLetter=${exercise}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching exercise questions:", error);
    return [];
  }
};

export const getExerciseAIResponse = async (
  question: string,
  answer: string,
  message: string
) => {
  try {
    const requestBody: ExerciseAIRequest = {
      question_title: question,
      question_answer: answer,
      prompt: message,
    };

    const { data } = await api.post("/exercise/response", requestBody);
    console.log("AI Response Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching AI answer:", error);
    return "Error fetching AI answer";
  }
};

export const saveExerciseAttempt = async (
  questionId: number,
  completedQuestions: number,
  totalQuestions: number
) => {
  try {
    console.log(questionId, completedQuestions, totalQuestions);
    const { data } = await api.post("/exercise/save-exercise-attempt", {
      questionId,
      completedQuestions,
      totalQuestions,
    });
    return data;
  } catch (error) {
    console.error("Error saving exercise attempt:", error);
    return null;
  }
};

export const getExerciseMCQAnswer = async (
  questionId: number
): Promise<MCQAnswerResponse> => {
  try {
    const { data } = await api.post(
      `/exercise/get-exercise-mcq-answer?questionId=${questionId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching MCQ answer:", error);
    throw new Error("Could not fetch MCQ answer");
  }
};

export const fetchSmartQuizQuestions = async (
  subject: string
): Promise<Question[]> => {
  try {
    const { data } = await api.post(
      `/exercise/smart-quiz-questions?subject=${subject}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching smart quiz questions:", error);
    return [];
  }
};
